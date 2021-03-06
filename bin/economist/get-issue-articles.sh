#!/usr/bin/env bash

CWD=`pwd`
BIN_DIR="${CWD}/bin/economist/"
DATA_DIR="data/economist/"
META_FILE="index.json"
SLEEP_TIME=10
MIN_FILE_SIZE=0

DATE=$1
YEAR="${DATE:0:4}"

ISSUE_DIR="${DATA_DIR}${YEAR}/${DATE}"

if [ -f "$ISSUE_DIR/${META_FILE}" ]; then
    echo "Retrieving issue: ${DATE}"

    node "${BIN_DIR}/get-issue-articles.js" $DATE | 
    while read -r URL; do
        # echo "[URL] ${URL}"
        # ARTICLE_ID=`echo ${URL} | grep -Eo "[[:digit:]]{7,8}"
        ARTICLE_ID=`expr match "$URL" '.*/\([0-9]\{5,8\}\)'`
        FILE_NAME="${ARTICLE_ID}.json"
        # echo "[FILE] ${FILE_NAME}"

        if [[ -z "${ARTICLE_ID}" ]]; then
            echo "[ERROR] Extracting ARTICLE ID from: ${URL}"

        elif  [ ! -f "${ISSUE_DIR}/${FILE_NAME}" ]; then
            echo "[SCRAPE] ${URL}"
            node "${BIN_DIR}/scrape-article.js" $URL > ${ISSUE_DIR}/${FILE_NAME}

            FILE_SIZE=$(wc -c <"${ISSUE_DIR}/${FILE_NAME}")
            if [ $FILE_SIZE -le $MIN_FILE_SIZE ]; then
                echo "[-WARN-] File size too small! ($FILE_SIZE). Deleting."
                rm ${ISSUE_DIR}/${FILE_NAME}

            else
                echo "[SAVED-] ${DATE}/${FILE_NAME} (${FILE_SIZE})"

            fi

            sleep $SLEEP_TIME
        fi
    done
fi

