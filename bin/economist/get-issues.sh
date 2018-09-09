#!/usr/bin/env bash

CWD=`pwd`
BIN_DIR="${CWD}/bin/economist/"
DATA_DIR="data/economist/"

YEAR=$1
YEAR_DIR="${DATA_DIR}${YEAR}"

cd $YEAR_DIR

for ISSUE_DIR in */; do
    ISSUE_DATE=${ISSUE_DIR:0:10}
    echo "[-GET-] Issue: $ISSUE_DATE"

    cd $CWD
    "${BIN_DIR}get-issue-articles.sh" ${ISSUE_DATE}
    cd $YEAR_DIR
done

cd $CWD
