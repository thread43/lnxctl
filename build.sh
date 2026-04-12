#!/bin/bash

set -e
set -o pipefail
set -u
set -x

cd "$(dirname "$0")"

date

[ -d build ] && rm -rf build
mkdir -p build/html

(cd lnxctl_web && npm run build)
cp -ar lnxctl_web/dist/* build/html/

(cd lnxctl_api && go build -ldflags="-s -w -extldflags=-static")
cp -a lnxctl_api/lnxctl build/

(cd sql && bash init_db_with_sqlite.sh)
cp -a sql/lnxctl.db build/

tar czf lnxctl.tar.gz build --transform s/^build/lnxctl/

date
