#!/bin/bash

amt_docker_image=$1
amt_service_path=$2
image_version=$3
python_password=$4


if [[ -n "${python_password}" ]]; then
    python_build_arg="--build-arg PYTHON_PASSWORD=${python_password}"
fi

version=$(echo ${image_version} | awk -F "=" '{print $2}')

echo "COMMAND: docker build -f ${amt_service_path} ${python_build_arg} -t armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:${version} --pull ${WORKSPACE}"
docker build -f ${amt_service_path} ${python_build_arg} -t armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:${version} --pull ${WORKSPACE}

echo "COMMAND: docker_image_id=$(docker images armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image} -q)"
docker_image_id=$(docker images armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image} -q)

echo "COMMAND: docker tag ${docker_image_id} armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:latest"
docker tag ${docker_image_id} armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:latest

echo "COMMAND: docker push armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:${version}"
docker push armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:${version}

echo "COMMAND: docker push armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:latest"
docker push armdocker.rnd.ericsson.se/proj_openstack_tooling/${amt_docker_image}:latest
