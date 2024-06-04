final setupNpm() {
    nodejs('v16 LTS') {
        sh """
        node --version
        yarn --version
        yarn install --frozen-lockfile
    """
    }
}

final getVersion() {
    nodejs('v16 LTS') {
        return sh(
                script: "node -pe \"require('./package.json').version\"",
                returnStdout: true
        ).trim()
    }
}

final build() {
    nodejs('v16 LTS') {
        sh """
            yarn build
            cd \$(pwd)/dist
            rm index.html
            gzip -r9 .
            find . -name '*.gz' -type f | while read NAME ; do mv "\${NAME}" "\${NAME%.gz}" ; done
        """
    }
}

final publishProd(String version) {
    final s3BasePath = "s3://fandom-ae-assets/tracking-opt-in"
    final s3VersionPath = "$s3BasePath/v$version/"
    final s3LatestPath = "$s3BasePath/latest/"
    sh """
        cd \$(pwd)/dist
        s3cmd -c /etc/s3cmd/amazon_prod.cfg put --acl-public --stop-on-error --recursive ./ --rinclude='.*.js\$' --rexclude='.*' --mime-type=application/javascript --add-header='Content-Encoding:gzip' $s3VersionPath
        s3cmd -c /etc/s3cmd/amazon_prod.cfg put --acl-public --stop-on-error --recursive ./ --rinclude='.*.js\$' --rexclude='.*' --mime-type=application/javascript --add-header='Content-Encoding:gzip' $s3LatestPath
    """
}

final publishBranch(String releaseType, String branch) {
    s3Path="s3://fandom-ae-assets/tracking-opt-in/$releaseType/$branch/"
    sh """
        cd \$(pwd)/dist
        s3cmd -c /etc/s3cmd/amazon_prod.cfg put --acl-public --stop-on-error --recursive ./ --rinclude='.*.js\$' --rexclude='.*' --mime-type=application/javascript --add-header='Content-Encoding:gzip' $s3Path
    """
}

final notifySlack(String text) {
    slackSend channel: '#adeng-release', message: text
}

final markReleaseStart(String environment, String version, String branch, String prLink, String buildUrl) {
    final commitMsg = releaseTracking.getGitCommitMessage()
    final relatedIssues = environment != 'Production' ? releaseTracking.getIssueKeysFromText(commitMsg) :
            releaseTracking.getIssueKeysFromGitDiff(releaseTracking.getLatestGitReleaseTag(environment: environment), "origin/${branch}")

    final issueKey = releaseTracking.changeStart(
            [
                    affectedApp        : "Fandom Community Platform",
                    affectedService    : "TrackingOptIn",
                    environment        : environment,
                    version            : "tracking-opt-in-${version}",
                    extraDescription   : """
                          Deployment information:
                          - *PR:* [${prLink}]
                          - *Branch:* [https://github.com/Wikia/tracking-opt-in/tree/${branch}]
                          - *Commit message:* ${commitMsg}
                          - *Build Url:* ${buildUrl}
                          """,
                    relatedIssues      : relatedIssues,
                    datacentersImpacted: ['amazon_prod'],
                    author             : releaseTracking.getBuildUserEmail()
            ]
    )
    echo "Jira issue key: ${issueKey}"
    return issueKey
}

def markReleaseFinish(boolean success, String issueKey, String environment) {
    releaseTracking.changeComplete(
            [
                    environment: environment,
                    issueKey   : issueKey,
                    success    : success
            ]
    )
}

return this
