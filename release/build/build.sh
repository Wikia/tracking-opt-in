#!/usr/bin/env bash
echo ">>>> Building release"
cd tracking-opt-in
yarn install --frozen-lockfile
yarn build
# npm config set @wikia:registry https://artifactory.wikia-inc.com/artifactory/api/npm/wikia-npm/
# npm publish --verbose
exit 0
