#!/bin/bash
set -euo pipefail

cd ..



docker build . -t otter-docs
docker run -p 8080:8080 -it --env-file ./.env --rm otter-docs