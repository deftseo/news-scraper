#!/usr/bin/env bash

CWD=`pwd`
BIN_DIR="${CWD}/bin/reuters/"
DATA_DIR="data/reuters/"
META_FILE="index.json"
SLEEP_TIME=10
MIN_FILE_SIZE=0

TODAY=`date +%Y-%m-%d`

START_DATE="2007-01-01"
END_DATE=$TODAY

CUR_DATE=$START_DATE
CUR_DATE_CMP=`date -d "$CUR_DATE" +%Y%m%d`
CUR_YEAR=`date -d "$CUR_DATE" +%Y`

END_DATE_CMP=`date -d "$END_DATE" +%Y%m%d`

YEAR_DIR="${DATA_DIR}${CUR_YEAR}"
DAILY_DIR="${DATA_DIR}${CUR_YEAR}/${CUR_DATE}"

while [ $CUR_DATE_CMP -le $END_DATE_CMP ]; do
    if [ ! -d $DAILY_DIR ]; then
        mkdir -p $DAILY_DIR
    fi

    DAILY_FILE="${DAILY_DIR}/${META_FILE}"

    if [ -f $DAILY_FILE ]; then
        FILE_SIZE=$(wc -c <"$DAILY_FILE")
        if [ $FILE_SIZE -le $MIN_FILE_SIZE ]; then
            echo "[-DEL-] ${CUR_DATE}: Too small! ($FILE_SIZE)."
            rm $DAILY_FILE
        fi

    fi

    if [ ! -f $DAILY_FILE ]; then
        echo "[-GET-] $CUR_DATE"
        node ${BIN_DIR}/scrape-daily-list.js ${CUR_DATE} > ${DAILY_FILE}

        FILE_SIZE=$(wc -c <"$DAILY_FILE")
        if [ $FILE_SIZE -le $MIN_FILE_SIZE ]; then
            echo "[-DEL-] ${CUR_DATE}: Too small! ($FILE_SIZE)."
            rm $DAILY_FILE
        else
            echo "[SAVED-] ${DAILY_FILE} (${FILE_SIZE})"
        fi

        sleep ${SLEEP_TIME}

    fi

    # Iterate current date
    CUR_DATE=`date -d "$CUR_DATE 1 day" +%Y-%m-%d`
    CUR_DATE_CMP=`date -d "$CUR_DATE" +%Y%m%d`
    CUR_YEAR=`date -d "$CUR_DATE" +%Y`

    YEAR_DIR="${DATA_DIR}${CUR_YEAR}"
    DAILY_DIR="${DATA_DIR}${CUR_YEAR}/${CUR_DATE}"
done

