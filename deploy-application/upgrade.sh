#!/bin/bash

export COMPOSE_PROJECT_NAME="amtproduction"

echo "INFO: Pulling down latest images from the docker artifactory."
echo "COMMAND: time docker-compose -f docker-compose-production.yml pull"
time docker-compose -f docker-compose-production.yml pull
if [[ $? -ne 0 ]]; then
    echo "ERROR: Failed to run docker-compose. Please investigate."
    exit 1
fi

echo "INFO: Creating a backup of the mongodb database before upgrading the application."
sh create_mongodb_backup.sh
if [[ $? -ne 0 ]]; then
    echo "ERROR: Failed to create mongodb database backup. Please investigate."
    exit 1
fi

echo "INFO: Upgrading the application using the latest images from the docker artifactory."
echo "COMMAND: time docker-compose -f docker-compose-production.yml up -d"
time docker-compose -f docker-compose-production.yml up -d
if [[ $? -ne 0 ]]; then
    echo "ERROR: Failed to run docker-compose. Please investigate."
    exit 1
fi

echo "INFO: Cleaning down dangling docker data."
echo "COMMAND: docker system prune --force"
docker system prune --force
