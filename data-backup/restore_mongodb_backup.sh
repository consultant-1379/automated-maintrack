#!/bin/bash

BACKUP_DIR=$1
if [[ -z "${BACKUP_DIR}" ]] || [[ ! -d "${BACKUP_DIR}" ]]; then
    echo "ERROR: You must specify a valid directory to restore the database from"
    exit 1
fi

echo "INFO: Restoring mongodb database from directory ${BACKUP_DIR}"
echo "COMMAND: docker run -it -v ${BACKUP_DIR}:/backup --network=amtproduction_default armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/mongo:4.0 mongorestore /backup --host database --drop"
docker run -it -v "${BACKUP_DIR}":/backup --network=amtproduction_default armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/mongo:4.0 mongorestore /backup --host database --drop
if [[ $? -ne 0 ]]; then
    echo "ERROR: Restore of mongodb database failed. Please investigate."
    exit 1
fi

echo "INFO: Restore successful."