#!/bin/bash

set -e
set -o pipefail
set -u
set -x

cd "$(dirname "$0")"

date

mysql -h127.0.0.1 -uroot -p123456 -e "DROP DATABASE IF EXISTS lnxctl"
mysql -h127.0.0.1 -uroot -p123456 -e "CREATE DATABASE lnxctl"

mysql -h127.0.0.1 -uroot -p123456 lnxctl <mysql/init_ddl.sql
mysql -h127.0.0.1 -uroot -p123456 lnxctl <mysql/init_dml.sql

date
