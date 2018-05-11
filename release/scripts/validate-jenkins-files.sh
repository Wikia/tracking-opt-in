#!/bin/bash
curl -X POST  -F "jenkinsfile=<release/jenkins" http://jenkins.wikia-prod:8080/pipeline-model-converter/validate
