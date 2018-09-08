#!/usr/bin/env bash

CWD=`pwd`
BIN_DIR="${CWD}/bin/economist/"
DATA_DIR="data/economist/"
META_FILE="index.json"

DATE=$1
YEAR="${DATE:0:4}"

ISSUE_DIR="${DATA_DIR}${YEAR}/${DATE}"

if [ -f "$ISSUE_DIR/${META_FILE}" ]; then
    echo "Retrieving issue: ${DATE}"

    node "${BIN_DIR}/get-issue-articles.js" $DATE | 
    while read -r URL; do
        echo "[GET] ${URL}"
        node "${BIN_DIR}/scrape-article.js" $URL
        sleep 60
    done
fi

