#!/usr/bin/env bash

CWD=`pwd`
BIN_DIR="${CWD}/bin/economist/"
DATA_DIR="data/economist/"
META_FILE="index.json"
SLEEP_TIME=5
MIN_FILE_SIZE=0

YEAR=2018

node ${BIN_DIR}scrape-issues-list.js ${YEAR}
${BIN_DIR}get-issue-meta.sh ${YEAR}
${BIN_DIR}get-issues.sh ${YEAR}

