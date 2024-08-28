#!/bin/sh

function get_changed_express_files() {
    js_files=""
    ts_files=""
    for each_script_name in ${modified_files}; do
        if [ $(echo ${each_script_name} | grep "services\/express") ]; then
            each_script_name=$(echo ${each_script_name} | sed 's/services\/express/\/usr\/src\/app/g')
            if [ $(echo -n ${each_script_name} | tail -c3) == ".js" ]; then
                js_files="${js_files} ${each_script_name} "
            elif [ $(echo -n ${each_script_name} | tail -c3) == ".ts" ]; then
                ts_files="${ts_files} ${each_script_name} "
            fi
        fi
    done
}

function run_eslint_on_express_files() {
    echo "*****************************************"
    echo "*       Express : Running ESLINT        *"
    echo "*****************************************"
    echo -e "\n"
    if [ -z "${js_files}" ]; then
        echo "======================================"
        echo "INFO: No JavaScript files were changed"
        echo "======================================"
        echo -e "\n"
    else
        ./node_modules/.bin/eslint ${js_files}
        if [ "$?" -ne 0 ]; then
            echo "============================================================"
            echo "ERROR : The ESLint for the changed express files has errors."
            echo "============================================================"
            echo -e "\n"
            exit_code=1
        else
            echo "================================"
            echo "SUCCESS : No ESLint errors found"
            echo "================================"
            echo -e "\n"
        fi
    fi
}


function run_tslint_on_express_files() {
    echo "*****************************************"
    echo "*       Express : Running TSLINT        *"
    echo "*****************************************"
    echo -e "\n"
    if [ -z "${ts_files}" ]; then
        echo "======================================="
        echo "INFO: No TypeScript files were changed "
        echo "======================================="
        echo -e "\n"
    else
        ./node_modules/.bin/tslint ${ts_files}
        if [ "$?" -ne 0 ]; then
            echo "============================================================"
            echo "ERROR : The TSLint for the changed express files has errors."
            echo "============================================================"
            exit_code=1
        else
            echo "================================"
            echo "SUCCESS : No TSLint errors found"
            echo "================================"
        fi
    fi
}

function run_unit_testcases() {
    npm run test-unit > unit_test_output.txt &
    unit_test_process_id="$!"
}


function run_integration_testcases() {
    npm run test-integration > integration_test_output.txt &
    integration_test_process_id="$!"
}

function print_unit_and_integration_output() {
    echo "======== Unit Tests ========"
    cat unit_test_output.txt
    echo -e "\n"
    echo "======== Integration Tests ========"
    cat integration_test_output.txt
    echo -e "\n"
}

function check_unit_or_integration_exit_code() {
    type_of_test="${1}"
    test_exit_code=${2}
    if [[ ${test_exit_code} -ne 0 ]]; then
        echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        echo "ERROR : The express ${type_of_test} tests have failed "
        echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        exit_code=1
    else
        echo "==========================================================="
        echo "SUCCESS : All the express ${type_of_test} tests have passed"
        echo "==========================================================="
    fi
    echo -e "\n"
}


function run_unit_and_integration_testcases() {
    echo "*********************************************************"
    echo "*    Express : Running Unit and Integration tests       *"
    echo "*********************************************************"
    echo -e "\n"
    run_unit_testcases
    wait ${unit_test_process_id} || unit_test_exit_code=$?
    run_integration_testcases
    wait ${integration_test_process_id} || integration_test_exit_code=$?
    print_unit_and_integration_output
    check_unit_or_integration_exit_code "unit" ${unit_test_exit_code}
    check_unit_or_integration_exit_code "integration" ${integration_test_exit_code}
}

function validate_exit_code() {
    if [[ ${exit_code} -ne 0 ]]; then
        exit 1
    fi
}

function execute_test_cleanup() {
    echo "=================================================================="
    echo "Cleaning up output files created as part of unit/integration tests"
    echo "=================================================================="
    rm -rf unit_test_output.txt
    rm -rf integration_test_output.txt
    echo -e "\n"
}

########################
#     SCRIPT START     #
########################
modified_files=$1
get_changed_express_files
run_eslint_on_express_files
run_tslint_on_express_files
run_unit_and_integration_testcases
execute_test_cleanup
validate_exit_code