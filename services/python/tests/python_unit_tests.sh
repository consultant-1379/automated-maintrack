#!/bin/bash

run_unit_tests() {
    unit_tests=$(find python_tests/unit_tests/ -name "*.py")
    for each_script_name in ${unit_tests}; do
        python -m unittest -v ${each_script_name};
        if [[ $? -ne 0 ]] ; then
            echo -e "\n"
            echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
            echo "Failed unit test ${each_script_name}"
            echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
            unit_test_fail_flag=true
        fi
    done
}

determine_if_tests_failed() {
    if [[ ${unit_test_fail_flag} = true ]] || [[ ${integration_test_fail_flag} = true ]]; then
        echo -e "\n"
        echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        echo "Some python tests failed. Please investigate..."
        echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        exit 1
    fi
}

########################
#     SCRIPT START     #
########################

unit_test_fail_flag=false
integration_test_fail_flag=false

run_unit_tests
determine_if_tests_failed
