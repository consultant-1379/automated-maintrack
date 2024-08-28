SUCCESSFUL_APTU_REPORT = '''{
    "children": [
        {
            "name" : "SYSTEM",
            "children" : [
                {
                    "name" : "No Dump files generated?",
                    "children" : [
                        {
                            "name" : "No Dump files generated?",
                            "uid" : "39ea549c271192b0",
                            "parentUid" : "e2fa392b1b4715434ef8225112dd43b0",
                            "status" : "passed"
                        }
                    ]
                }
            ]
        }
    ]
}
'''

SKIPPED_APTU_REPORT = '''{
    "children": [
        {
            "name" : "SYSTEM",
            "children" : [
                {
                    "name" : "No Dump files generated?",
                    "children" : [
                        {
                            "name" : "No Dump files generated?",
                            "uid" : "39ea549c271192b0",
                            "status" : "skipped"
                        }
                    ]
                }
            ]
        }
    ]
}
'''

FAILED_HIGH_LEVEL_APTU_REPORT_ONE_FAILURE = '''{
    "children": [
        {
            "name" : "SYSTEM",
            "children" : [
                {
                    "name" : "No Dump files generated?",
                    "children" : [
                        {
                            "name" : "No Dump files generated?",
                            "uid" : "39ea549c271192b0",
                            "status" : "failed"
                        }
                    ]
                }, {
                    "name" : "No Faulted VCS events occurred?",
                    "children" : [
                        {
                            "name" : "No Faulted VCS events occurred?",
                            "uid" : "e115ebe44e55f152",
                            "status" : "passed"
                        }
                    ]
                }
            ]
        }
    ]
}
'''

FAILED_LOW_LEVEL_APTU_REPORT_ONE_FAILURE = '''{
    "name": "No Dump files generated?",
    "fullName": "assertions.system_assertions.SystemAssertions#test_no_dump_files_generated",
    "descriptionHtml": "<p>FillerText</p><p>TEST_ID - SYS_ENM_M0WL</p><p>MoreFillerText</p>"
}'''

APTU_REPORT_ONE_FAILURE_OUTPUT = '''{
  "test_no_dump_files_generated": ["No Dump files generated?"]
}'''

FAILED_HIGH_LEVEL_APTU_REPORT_MULTIPLE_FAILURES = '''{
    "children": [
        {
            "name" : "SYSTEM",
            "children" : [
                {
                    "name" : "No Dump files generated?",
                    "children" : [
                        {
                            "name" : "No Dump files generated?",
                            "uid" : "39ea549c271192b0",
                            "status" : "failed"
                        }
                    ]
                }, {
                    "name" : "No Faulted VCS events occurred?",
                    "children" : [
                        {
                            "name" : "No Faulted VCS events occurred?",
                            "uid" : "e115ebe44e55f152",
                            "status" : "failed"
                        }
                    ]
                }, {
                    "name" : "No CleanStart VCS events occurred?",
                    "children" : [
                        {
                            "name" : "No CleanStart VCS events occurred?",
                            "uid" : "7bd55a57314848e5",
                            "status" : "passed"
                        }
                    ]
                }
            ]
        }, {
            "name": "NEO4J",
            "children": [
                {
                    "name": "Are Neo4j Garbage Collection peak times within threshold?",
                    "children": [
                        {
                            "name": "Are Neo4j Garbage Collection peak times within threshold?",
                            "uid": "c874a767bc5929d0",
                            "status": "failed"
                        }
                    ]
                }
            ]
        }
    ]
}
'''

FIRST_FAILED_LOW_LEVEL_APTU_REPORT_MULTIPLE_FAILURES = '''{
    "name": "No Dump files generated?",
    "fullName": "assertions.system_assertions.SystemAssertions#test_no_dump_files_generated",
    "descriptionHtml": "<p>FillerText</p><p>TEST_ID - SYS_ENM_M0WL</p><p>MoreFillerText</p>"
}'''

SECOND_FAILED_LOW_LEVEL_APTU_REPORT_MULTIPLE_FAILURES = '''{
    "name": "No Faulted VCS events occurred?",
    "fullName": "assertions.system_assertions.SystemAssertions\
        #test_assert_no_faulted_vcs_events_occurred",
    "descriptionHtml": "<p>FillerText</p><p>TEST_ID - SYS_ENM_DUMO</p><p>MoreFillerText</p>"
}'''

THIRD_FAILED_LOW_LEVEL_APTU_REPORT_MULTIPLE_FAILURES = '''{
    "name": "Are Neo4j Garbage Collection peak times within threshold?",
    "fullName": "assertions.system_assertions.SystemAssertions\
        #test_assert_neo4j_garbage_collection_is_within_threshold",
    "descriptionHtml": "<p>FillerText</p><p>TEST_ID - NEO4J_ENM_ZD0U</p><p>MoreFillerText</p>"
}'''

APTU_REPORT_MULTIPLE_FAILURES_OUTPUT = '''{
  "test_no_dump_files_generated": ["No Dump files generated?"],
  "test_assert_no_faulted_vcs_events_occurred"\
      : ["No Faulted VCS events occurred?"],
  "test_assert_neo4j_garbage_collection_is_within_threshold"\
      : ["Are Neo4j Garbage Collection peak times within threshold?"]
}'''

SUCCESSFUL_ALLURE_REPORT = '''
{
    "testSuites": [
        {
            "uid": "c57d58d842be28a0",
            "name": "SoftwareHardwareManager_Restore_RFA250-Thalaiva",
            "title": "SoftwareHardwareManager_Restore_RFA250-Thalaiva",
            "time": {
                "start": 1601744049513,
                "stop": 1601744297368,
                "duration": 247855
            },
            "statistic": {
                "total": 1,
                "passed": 1,
                "pending": 0,
                "canceled": 0,
                "failed": 0,
                "broken": 0
            },
            "description": null,
            "testCases": [
                {
                    "uid": "9741e9a59a0ab043",
                    "name": "TORF-10019_TORF-34793",
                    "title": "Create CV/Backup node, Backup inventory, Delete CV, Restore (CV)",
                    "time": {
                        "start": 1601744049513,
                        "stop": 1601744297368,
                        "duration": 247855
                    },
                    "severity": "BLOCKER",
                    "status": "PASSED"
                }
            ]
        }
    ]
}'''

FAILED_ALLURE_REPORT = '''
{
    "testSuites": [
            {
            "uid": "911bee92a842d432",
            "name": "AddNode_ModelDrivenRFA250 - Xfiles",
            "title": "AddNode_ModelDrivenRFA250 - Xfiles",
            "time": {
                "start": 1601745879776,
                "stop": 1601746196288,
                "duration": 316512
            },
            "statistic": {
                "total": 1,
                "passed": 0,
                "pending": 0,
                "canceled": 0,
                "failed": 1,
                "broken": 0
            },
            "description": null,
            "testCases": [
                {
                    "uid": "d838621915d24fdb",
                    "name": "TORF-202584-TA01",
                    "title": "Add and delete several nodes via REST interface",
                    "time": {
                        "start": 1601745879776,
                        "stop": 1601746196288,
                        "duration": 316512
                    },
                    "severity": "BLOCKER",
                    "status": "FAILED"
                }
            ]
        }
    ]
}'''

ALLURE_REPORT_FAILURE_OUTPUT = '''{
  "AddNode_ModelDrivenRFA250 - Xfiles": ["Add and delete several nodes via REST interface"]
}'''

BROKEN_ALLURE_REPORT = '''
{
    "testSuites": [
        {
            "uid": "3f1922b620d10928",
            "name": "NSCS_SL2 - Ciphers",
            "title": "NSCS_SL2 - Ciphers",
            "time": {
                "start": 1601744308722,
                "stop": 1601744309122,
                "duration": 400
            },
            "statistic": {
                "total": 3,
                "passed": 0,
                "pending": 0,
                "canceled": 0,
                "failed": 0,
                "broken": 3
            },
            "description": null,
            "testCases": [
                {
                    "uid": "71dd91779a8c014e",
                    "name": "no test ID provided",
                    "title": "no test ID provided",
                    "time": {
                        "start": 1601744308722,
                        "stop": 1601744308726,
                        "duration": 4
                    },
                    "severity": "NORMAL",
                    "status": "BROKEN"
                },
                {
                    "uid": "c20d1014f513632c",
                    "name": "no test ID provided",
                    "title": "no test ID provided",
                    "time": {
                        "start": 1601744308923,
                        "stop": 1601744308923,
                        "duration": 0
                    },
                    "severity": "NORMAL",
                    "status": "BROKEN"
                },
                {
                    "uid": "7222a0a09866b28a",
                    "name": "no test ID provided",
                    "title": "no test ID provided",
                    "time": {
                        "start": 1601744309121,
                        "stop": 1601744309122,
                        "duration": 1
                    },
                    "severity": "NORMAL",
                    "status": "BROKEN"
                }
            ]
        }
    ]
}'''

ALLURE_REPORT_BROKEN_OUTPUT = '''{
  "NSCS_SL2 - Ciphers": ["no test ID provided", "no test ID provided", "no test ID provided"]
}'''

FAILED_HIGH_LEVEL_ADU_REPORT = '''{
    "testSuites" : [
        {
            "testCases" : [{
                "uid" : "e718da8c55b0a8d7",
                "status" : "FAILED"
            }]
        }
    ]
}'''

FAILED_LOWLEVEL_ADU_REPORT = '''{
    "failure": {
        "message": "Failed to wait for Upgrade to start."
    }
}'''

ADU_REPORT_FAILED_OUTPUT = '''{
  "UpgradeAvailability": ["UpgradeAvailability"]
}'''

SUCCESSFUL_ADU_REPORT = '''{
    "testSuites" : [ {
        "testCases" : [ {
            "status" : "PASSED"
        } ]
    } ]
}'''
