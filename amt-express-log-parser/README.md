# AMT Express Log Parser Script
This Python script `parse_amt_express_log.py` can be used to parse AMT express logs to make them readable for troubleshooting. It just spaces things out, converts dates to a readable format and makes those big clumps of json log readable as single key: value lines.

## Usage
It's straight forward to use, just make sure you are using Python 3 as it uses some Python 3 specific features:

1. Copy a chunk of log that you want to parse into a readable format from the AMT express container, e.g. in production it would be:
    ```
    docker logs amtproduction_express_1
    ```
2. Paste the log into a file called `RAW.log` in the same directory as the script.
3. Run the script:
    ```
    python parse_amt_express_log.py
    ```
The script will create a file called OUT.log in a relatively readable format.

**NOTE: This OUT.log file get's appended to, not overwritten.**