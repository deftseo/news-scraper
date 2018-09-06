#!/usr/bin/env bash

CWD=`pwd`
BIN_DIR="${CWD}/bin/economist/"
DATA_DIR="data/economist/"
META_FILE="index.json"

MIN_FILE_SIZE=0

YEAR=$1
YEAR_DIR="${DATA_DIR}${YEAR}"

# echo $YEAR_DIR
# echo $BIN_DIR

cd $YEAR_DIR

for ISSUE_DIR in */; do
    # echo "$ISSUE_DIR"
    ISSUE_FILE="${ISSUE_DIR}${META_FILE}"
    
    if [ ! -f $ISSUE_FILE ]; then
        ISSUE_DATE="${ISSUE_DIR::-1}"
        echo "Creating: ${ISSUE_DATE}/${META_FILE}"
        node ${BIN_DIR}scrape-issue-meta.js $ISSUE_DATE > $ISSUE_FILE

        FILE_SIZE=$(wc -c <"$ISSUE_FILE")
        if [ $FILE_SIZE -le $MIN_FILE_SIZE ]; then
            echo "Too small! ($FILE_SIZE). Deleting."
            rm $ISSUE_FILE
        fi

    fi
done;

cd $CWD


