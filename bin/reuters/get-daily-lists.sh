#!/usr/bin/env bash

TODAY=`date +%Y-%m-%d`

START_DATE="2007-01-01"
END_DATE=$TODAY

CUR_DATE=$START_DATE
CUR_DATE_CMP=`date -d "$CUR_DATE" +%Y%m%d`
CUR_YEAR=`date -d "$CUR_DATE" +%Y`

END_DATE_CMP=`date -d "$END_DATE" +%Y%m%d`


while [ $CUR_DATE_CMP -le $END_DATE_CMP ]; do
    echo "$START_DATE => $END_DATE, $CUR_DATE_CMP => $END_DATE_CMP"

    # Iterate current date
    CUR_DATE=`date -d "$CUR_DATE 1 day" +%Y-%m-%d`
    CUR_DATE_CMP=`date -d "$CUR_DATE" +%Y%m%d`
    CUR_YEAR=`date -d "$CUR_DATE" +%Y`
done

