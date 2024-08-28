#!/bin/bash

BACKUP_LOCATION="/export/PS/AMT"
TODAYS_BACKUPS="${BACKUP_LOCATION}"/$(date "+%Y%m%d")
RETENTION_PERIOD=$((5*24*60)) #5 days

echo "INFO: Zipping up daily backup of the mongodb database to ${TODAYS_BACKUPS}.zip."
echo "COMMAND: zip -r ${TODAYS_BACKUPS} ${TODAYS_BACKUPS}*"
zip -r "${TODAYS_BACKUPS}" "${TODAYS_BACKUPS}"*
if [[ $? -ne 0 ]]; then
    echo "ERROR: Failed to zip backup files. Please investigate."
    exit 1
fi

echo "INFO: Removing hourly backup folders as they are no longer needed."
echo "COMMAND: rm -rf ${TODAYS_BACKUPS}*/"
rm -rf "${TODAYS_BACKUPS}"*/
if [[ $? -ne 0 ]]; then
    echo "ERROR: Failed to remove hourly backup folders. Please investigate."
    exit 1
fi

echo "INFO: Removing backups older than 5 days from ${BACKUP_LOCATION}."
echo "COMMAND: find ${BACKUP_LOCATION} -name *.zip -mmin +${RETENTION_PERIOD} | xargs rm -rf"
find "${BACKUP_LOCATION}" -name "*.zip" -mmin +"${RETENTION_PERIOD}" | xargs rm -rf
if [[ $? -ne 0 ]]; then
    echo "ERROR: Failed to remove backups older than 5 days. Please investigate."
    exit 1
fi
