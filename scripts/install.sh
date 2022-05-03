#!/bin/bash
set -euo pipefail

cd ..

helm upgrade --install otter-docs -n otter-docs -f indigo-values.yaml ./chart