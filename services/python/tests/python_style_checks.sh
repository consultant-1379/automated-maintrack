#!/bin/bash

function get_changed_python_files() {
    py_files=""
    for each_script_name in ${files_changed}; do  
        if [[ $(echo ${each_script_name} | grep "services\/python") ]]; then
            each_script_name=$(echo ${each_script_name} | sed 's/services\/python/\/usr\/src\/app/g')  
            if [[ ${each_script_name: -3} == ".py" ]] && [[ "${each_script_name}" != *"__init__.py" ]]; then
                py_files="${py_files} ${each_script_name} "
            fi
        fi
    done
}

function start_python_check() {
    echo
    echo "*******************************************"
    echo "*  CHECKING FOR PYTHON SYNTAX VIOLATIONS  *"
    echo "*******************************************"

    if [[ -z "${py_files}" ]]; then
        echo "INFO: No PYTHON Files Changed"
        exit 0
    fi
}

function run_pylint_checks() {
    echo -e "\n"
    echo "===== INFO: Running PYLINT Check ====="
    echo -e "\n"
    is_pylint_failed=0
    for each_script_name in ${py_files}; do
        if [[ ${each_script_name: -3} == ".py" ]] && [[ "${each_script_name}" != *"__init__.py" ]]; then
            echo "Checking Python file: ${each_script_name}"
            echo "+++++++++++ ${each_script_name} ++++++++++" >> pylint_results.txt
            pylint "${each_script_name}"  >> pylint_results.txt
            cat pylint_results.txt
            pylint_rating=$(python -c "from pylint.lint import Run; results = Run(['${each_script_name}', '--disable=W0403,line-too-long'], do_exit=False); print(results.linter.stats['global_note'])")
            pylint_rating_score=$(echo ${pylint_rating} | awk 'NF>1{print $NF}')
            pylint_errors=$(python -c "from pylint.lint import Run; results = Run(['${each_script_name}', '--disable=W0403,line-too-long'], do_exit=False); print(results.linter.stats['error'])")
            pylint_errors_caught=$(echo ${pylint_errors} | awk 'NF>1{print $NF}')
            if [[ ${pylint_errors_caught} -ne 0 ]]; then
                echo "You have ${pylint_errors_caught} errors in your code"
                boolean_flag="false"
                let "number_of_failures++"
                echo -e "\n"
                echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
                echo "FATAL: ${each_script_name} has errors, will likely fail at compile time."
                echo "INFO: Check pylint_results.txt in workspace for full pylint report"
                echo "INFO: ${pylint_errors}"
                echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
                echo -e "\n"
                is_passed=1
                python_script_with_violations+="\t${each_script_name} "
                is_pylint_failed=1
            else
                pylint_score_two_decimal_places=${pylint_rating_score:0:4}
                echo "You got a rating of ${pylint_score_two_decimal_places} / 10"
                if [[ ${pylint_rating_score%.*} -lt 9 ]]; then
                    echo "WARNING: You need a minimum rating of  9/10 to pass pylint"
                    is_passed=1
                    is_pylint_failed=1
                fi
                check_if_syntax_violations_occurred ${is_passed}
            fi
            is_passed=0
        fi
    done
}

function run_pycodestyle_checks() {
    echo -e "\n"
    echo "===== INFO: Running pycodestyle Check ====="
    echo -e "\n"
    is_pycodestyle_running=0
    is_pycodestyle_failed=0
    python_script_with_violations+="pycodestyle: "
    for each_script_name in ${py_files}; do
        if [[ ${each_script_name: -3} == ".py" ]] && [[ "${each_script_name}" != *"__init__.py" ]]; then
            echo "Checking Python file: ${each_script_name}"
            pycodestyle "${each_script_name}" --config="/usr/src/app/tests/pycodestyle.cfg"
            check_if_syntax_violations_occurred $?
        fi
    done
}

function check_if_syntax_violations_occurred() {
    if [[ $1 -ne "0" ]]; then
        boolean_flag="false"
        let "number_of_failures++"
        python_script_with_violations+="\t${each_script_name} "
        echo -e "\n"
        echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        echo "ERROR: ${each_script_name} has syntax violations"
        echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        echo -e "\n"
        if [[ "${is_pycodestyle_running}" == "0" ]]; then
            is_pycodestyle_failed=1
        else
            is_pylint_failed=1
        fi
    else
        echo "SUCCESS: ${each_script_name} has Successfully Passed"
        echo -e "\n"
    fi
}

function check_exit_criteria() {
    if [[ "${boolean_flag}" == "false" ]]; then
        echo -e "\n"
        echo "============================================================================"
        echo "Failure: ${number_of_failures} python syntax violations Flagged"
        echo "Files with python violations: "
        echo "PYLINT:"
        if [[ ${is_pylint_failed} -eq "0" ]]; then
            echo -e "\tPylint has no Violations"
        fi
        for python_violation in ${python_script_with_violations[@]}; do
            echo -e "${python_violation}"
        done
        if [[ ${is_pycodestyle_failed} -eq "0" ]]; then
            echo -e "\tpycodestyle has no Violations"
        fi

        echo "============================================================================"
        echo -e "\n"
        exit 1
    else
        echo -e "\n"
        echo "=========================================="
        echo "PASS: All python syntax checks have passed"
        echo "=========================================="
        echo -e "\n"
    fi
}

########################
#     SCRIPT START     #
########################
files_changed=$1
get_changed_python_files
start_python_check
run_pylint_checks
run_pycodestyle_checks
check_exit_criteria