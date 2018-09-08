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
        echo "[GET-] ${URL}"
        ARTICLE_ID=`echo ${URL} | grep -Eo "[[:digit:]]+"`
        FILE_NAME="${ARTICLE_ID}.json"
        echo "[FILE] ${FILE_NAME}"

        if [ ! -f "${ISSUE_DIR}/${FILE_NAME}" ]; then
            echo "[GET] ${ISSUE_DIR}/${FILE_NAME}"
            node "${BIN_DIR}/scrape-article.js" $URL > ${ISSUE_DIR}/${FILE_NAME}
            sleep 60
        fi
    done
fi

