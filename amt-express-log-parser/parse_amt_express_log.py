import json
from datetime import datetime


def parse_patch_slots(msg):
    '''
    Patch slot log line msgs are passed to this function.
    It firsts grab just the json portion of log message.
    It then converts it to a dictionary.
    It then converts the datetimes from millisecond timestamps to readable strings.
    :param: msg
    :return: Reformatted patch slot log line msg
    '''
    trim = msg[msg.index('{'):]
    parsed_message = json.loads(trim)
    new_message = ''
    for key in parsed_message:
        if key == 'createdOn' or key == 'modifiedOn':
            parsed_message[key] = datetime.fromtimestamp(
                parsed_message[key]/1000.0).strftime('%c')
        new_message += f'\t{key}: {parsed_message[key]}\n'
    return new_message


def parse_time(time):
    '''
    Timestamps are passed to this function.
    It converts them to "ctime" - a readable string representation.
    :param: time
    :return: A readable string form timestamp
    '''
    date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    formatted = datetime.strptime(time, date_format)
    return formatted.ctime()


def write_to_file(log_item):
    '''
    Log Items are passed to this function, this can either be a dict or a str.
    If a dict is passed it writes it as key: value to the output log.
    If a str is passed it just logs the string as-is.
    :param: log_item
    '''
    with open('OUT.log', 'a') as outlog:
        if(type(log_item) is dict):
            for key in log_item:
                outlog.write(f'{key}: {log_item[key]}\n')
        else:
            outlog.write(f'{log_item}')
        outlog.write('\n')


def write_rawlog_to_outlog():
    '''
    Opens the RAW.log file and reads it line by line, passing each
    line to the previous helper functions in this file where necessary.
    As each line is parsed it's written to the output log. Any case that
    is not handled is just appended to the log as-is.
    '''
    with open('RAW.log', 'r') as raw_log:
        for line in raw_log:
            if line.startswith('{'):
                log_item = json.loads(line)
                if log_item['msg'].startswith('patchSlot'):
                    log_item['msg'] = parse_patch_slots(log_item['msg'])
                log_item['time'] = parse_time(log_item['time'])
                write_to_file(log_item)
            else:
                write_to_file(line)


if __name__ == '__main__':
    write_rawlog_to_outlog()
