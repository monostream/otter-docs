#!/bin/bash
set -euo pipefail

az login
az account set --subscription "Tribbles" 
az acr login -n tribblesregistry

cd ..

docker build --platform linux/amd64 . -t tribblesregistry.azurecr.io/otter-docs
docker push tribblesregistry.azurecr.io/otter-docs

cd example/

docker build --platform linux/amd64 . -t tribblesregistry.azurecr.io/otter-docs-example
docker push tribblesregistry.azurecr.io/otter-docs-example