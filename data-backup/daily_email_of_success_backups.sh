#!/bin/bash

BACKUP_ROOT="/export/PS/AMT"
SUCCESSFUL_BACKUPS_FILE="${BACKUP_ROOT}/successful_backups.txt"

echo "INFO: Triggering Jenkins Job to send E-Mail to the team."
echo "COMMAND: curl -X POST https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/Send_AMT_Backups_Notifications/build --user bbfuncuser:${FEM4S11_API_TOKEN} --form bkfile=@${SUCCESSFUL_BACKUPS_FILE} --form json='{parameter: [{name:backup_file, file:bkfile}, {name:daily_mail, value:YES}]}'"
curl -X POST https://fem4s11-eiffel004.eiffel.gic.ericsson.se:8443/jenkins/job/Send_AMT_Backups_Notifications/build --user bbfuncuser:"${FEM4S11_API_TOKEN}" --form bkfile=@"${SUCCESSFUL_BACKUPS_FILE}" --form json='{"parameter": [{"name":"backup_file", "file":"bkfile"}, {"name":"daily_mail", "value":"YES"}]}'
if [[ $? -ne 0 ]]; then
    echo "ERROR: Trigger of Jenkins job failed. Please investigate"
    exit 1
fi

echo "INFO: Removing file of successful backups log file: ${SUCCESSFUL_BACKUPS_FILE}."
echo "COMMAND: rm -rf ${SUCCESSFUL_BACKUPS_FILE}"
rm -rf "${SUCCESSFUL_BACKUPS_FILE}"
if [[ $? -ne 0 ]]; then
    echo "ERROR: Removal of successful backups log file failed. Please investigate."
    exit 1
fi