#!/bin/bash
set -euo pipefail

cd ..

docker build --platform linux/amd64 . -t monostream/otter-docs
docker push monostream/otter-docs

cd example/

docker build --platform linux/amd64 . -t monostream/otter-docs-example
docker push monostream/otter-docs-example