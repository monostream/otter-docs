#!/bin/bash
set -euo pipefail

cd ..



docker build . -t otter-docs:0.1
docker run -p 8080:8080 --rm --env GIT_URL="https://cblaettl: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@github.com/monostream/2pack-docs.git" otter-docs:0.1