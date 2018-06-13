#!/usr/bin/env bash

set -ex

export CI=true

yarn build
yarn test
URL=$(now --name world-cup-quiz-graphql -e GOOGLE_API_KEY=@google_api_key)
now alias ${URL} graphql.vm.kennethaasan.no
