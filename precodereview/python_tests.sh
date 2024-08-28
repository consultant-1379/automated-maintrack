#!/bin/bash

function run_python_tests() {
    echo "*****************************************"
    echo "*        Running Python tests           *"
    echo "*****************************************"
    echo -e "\n"
    echo "COMMAND: time docker-compose run --rm python /bin/bash tests/python_unit_tests.sh --force-recreate"
    time docker-compose run --rm python /bin/bash  tests/python_unit_tests.sh --force-recreate
    if [[ $? -ne 0 ]]; then
        echo "========================================="
        echo "ERROR : The Python unit tests have failed"
        echo "========================================="
        exit 1
    else
        echo "==============================================="
        echo "SUCCESS : All the Python unit tests have passed"
        echo "==============================================="
    fi

}

function run_linter_checks() {
    # TODO RTD-14352 Remove below line
    echo "$(grep -v "services/python/miscellaneous/amt_ml_dataset_generator/build_log_scraper.py" diff.txt)" > diff.txt
    files_changed=$(cat < diff.txt)
    echo "*****************************************"
    echo "*         Running linter checks         *"
    echo "*****************************************"
    echo -e "\n"
    echo "COMMAND: time docker-compose run --rm python /bin/bash tests/python_style_checks.sh ${files_changed} --force-recreate"
    time docker-compose run --rm python /bin/bash  tests/python_style_checks.sh "${files_changed}" --force-recreate
    if [[ $? -ne 0 ]]; then
        echo "====================================="
        echo "ERROR : The linter checks have failed"
        echo "====================================="
        exit 1
    else
        echo "==========================================="
        echo "SUCCESS : All the linter checks have passed"
        echo "==========================================="
    fi

}

########################
#     SCRIPT START     #
########################
run_python_tests
run_linter_checks
