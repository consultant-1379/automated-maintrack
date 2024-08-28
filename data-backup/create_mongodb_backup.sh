#!/bin/bash
BACKUP_ROOT="/export/PS/AMT"
SUCCESSFUL_BACKUPS_FILE="${BACKUP_ROOT}/successful_backups.txt"
BACKUP_FOLDER_NAME=$(date "+%Y%m%d%H%M%S")
BACKUP_DIR="${BACKUP_ROOT}/${BACKUP_FOLDER_NAME}"

echo "INFO: Creating backup directory: ${BACKUP_DIR}"
echo "COMMAND: mkdir -p ${BACKUP_DIR}"
mkdir -p "${BACKUP_DIR}"
if [[ $? -ne 0 ]]; then
    echo "ERROR: Failed to create backup directory. Please investigate."
    exit 1
fi

echo "COMMAND: chmod 777 ${BACKUP_DIR}"
chmod 777 "${BACKUP_DIR}"

echo "INFO: Creating mongodb backup"
echo "COMMAND: docker run -v ${BACKUP_DIR}:/backup --network=amtproduction_default armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/mongo:4.0 mongodump --db=automatedMaintrackDB --out /backup --host database"
docker run -v "${BACKUP_DIR}":/backup --network=amtproduction_default armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/mongo:4.0 mongodump --db=automatedMaintrackDB --out /backup --host database
if [[ $? -ne 0 ]]; then
    echo "ERROR: Creation of mongodb backup failed. Please investigate. Triggering Jenkins job to notify team."
    echo "COMMAND: curl -X POST https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/Send_AMT_Backups_Notifications/build --user bbfuncuser:${FEM4S11_API_TOKEN} --data-urlencode json='{parameter: [{name:daily_mail, value:NO}]}'"
    curl -X POST https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/Send_AMT_Backups_Notifications/build --user bbfuncuser:"${FEM4S11_API_TOKEN}" --data-urlencode json='{"parameter": [{"name":"daily_mail", "value":"NO"}]}'
    exit 1
fi

echo "INFO: Creation of mongodb backup successful. Writing successfully backed up data date to successful backups log file."
echo "${BACKUP_FOLDER_NAME}" >> "${SUCCESSFUL_BACKUPS_FILE}"