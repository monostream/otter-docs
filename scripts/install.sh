#!/bin/bash
set -euo pipefail

cd ..

helm upgrade --install otter-docs -n otter-docs -f values.yaml ./chart
helm upgrade --install otter-docs-example -n otter-docs -f example/values.yaml ./example/chart