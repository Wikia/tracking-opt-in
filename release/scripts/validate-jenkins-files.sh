#!/bin/bash
if [[ -z $JENKINS_URL ]]; then
    echo "Unable to validate with a \$JENKINS_URL environment variable."
    exit 1
fi

curl -X POST  -F "jenkinsfile=<release/jenkins" $JENKINS_URL/pipeline-model-converter/validate
