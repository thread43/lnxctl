#!/bin/bash

set -e
set -o pipefail
set -u
set -x

cd "$(dirname "$0")"

date

rm -rf build

rm -f lnxctl.tar.gz

rm -f lnxctl_api/lnxctl
rm -f lnxctl_api/lnxctl.db

rm -rf lnxctl_web/dist

date
