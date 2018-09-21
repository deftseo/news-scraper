#!/usr/bin/env bash

CWD=`pwd`
BIN_DIR="${CWD}/bin/reuters/"
DATA_DIR="data/reuters/"
META_FILE="index.json"
SLEEP_TIME=10
MIN_FILE_SIZE=0

DATE=$1
YEAR="${DATE:0:4}"

ISSUE_DIR="${DATA_DIR}${YEAR}/${DATE}"

if [ -f "$ISSUE_DIR/${META_FILE}" ]; then
    echo "Retrieving daily: ${DATE}"

    node "${BIN_DIR}get-daily-articles.js" $DATE | 
    while read -r URL; do
        ARTICLE_ID=`expr match "$URL" '.*-id\([A-Za-z0-9+]\+\)'`
        FILE_NAME="${ARTICLE_ID}.json"

        if [ ! -f "${ISSUE_DIR}/${FILE_NAME}" ]; then
            echo "[SCRAPE] ${URL}"
            node "${BIN_DIR}/scrape-article.js" $URL > ${ISSUE_DIR}/${FILE_NAME}

            FILE_SIZE=$(wc -c <"${ISSUE_DIR}/${FILE_NAME}")
            if [ $FILE_SIZE -le $MIN_FILE_SIZE ]; then
                echo "[-WARN-] File size too small! ($FILE_SIZE). Deleting."
                rm ${ISSUE_DIR}/${FILE_name}

            else
                echo "[SAVED-] ${DATE}/${FILE_NAME} (${FILE_SIZE})"

            fi

            sleep $SLEEP_TIME
        fi
    done
fi

