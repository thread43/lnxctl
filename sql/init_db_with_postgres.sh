#!/bin/bash

set -e
set -o pipefail
set -u
set -x

cd "$(dirname "$0")"

date

# psql -U postgres
# \c
# create user lnxctl with password '123456';
# create database lnxctl owner lnxctl encoding 'utf8';
# \c lnxctl lnxctl

PGPASSWORD="123456" psql -h127.0.0.1 -Upostgres -dpostgres -c "DROP DATABASE IF EXISTS lnxctl"
PGPASSWORD="123456" psql -h127.0.0.1 -Upostgres -dpostgres -c "CREATE DATABASE lnxctl OWNER lnxctl ENCODING 'utf8'"

PGPASSWORD="123456" psql -h127.0.0.1 -Ulnxctl -dlnxctl -f postgres/init_ddl.sql
PGPASSWORD="123456" psql -h127.0.0.1 -Ulnxctl -dlnxctl -f postgres/init_dml.sql

date
