#!/bin/bash
set -euo pipefail

cd ..

docker build --platform linux/amd64 . -t tribblesregistry.azurecr.io/otter-docs
docker push tribblesregistry.azurecr.io/otter-docs
