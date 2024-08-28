import logging, os, smtplib, argparse
import socket, string, random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

SMTP_SERVER = 'smtp-central.internal.ericsson.com'
FROM_EMAIL_ADDRESS = 'automated.maintrack@ericsson.com'

class AMTMailer():
    """
    Mailer functionality for sending emails from AMT
    """
    def __init__(self, recipients, subject, identifier, home_directory):
        self.message = MIMEMultipart()
        self.message['From'] = FROM_EMAIL_ADDRESS
        self.parse_recipients(recipients)
        self.message['Subject'] = subject
        self.server = smtplib.SMTP(SMTP_SERVER)
        self.home_directory = home_directory
        self.unique_file = '%semail-content-%s.html' % (home_directory, identifier)
    
    def uniquify_email_content(self):
        """
        Makes the email content file name unique.
        :return boolean:
        """
        email_content = '%semail-content.html' % self.home_directory
        if os.path.exists(email_content):
            os.rename(email_content, self.unique_file)
            return True
        else:
            logging.error('No email-content file present to uniquify.')
            return False

    def parse_recipients(self, recipients):
        """
        :param recipients: who we want to send the email to
        Functionality to check the format of recipients and do formating as necessary.
        """
        if (',' in recipients):
            all_recipients = recipients.split(",")
            self.recipients = all_recipients
            self.message['To'] = ", ".join(all_recipients)
        else:
            self.recipients =  eval('[\'' + recipients + '\']')
            self.message['To'] = recipients

    def get_html_body(self):
        """
        Read the HTML file to be used for the email.
        """
        html_file_body = open(self.unique_file, 'r')
        return html_file_body.read()

    def attach_logo(self):
        """
        Attach the logo to the email and set the content ID.
        """
        logo = open(self.home_directory + 'mailer/assets/ericsson_logo.png', 'rb')
        message_logo = MIMEImage(logo.read())
        logo.close()

        message_logo.add_header('Content-ID', '<ericssonLogo>')
        self.message.attach(message_logo)

    def attach_html_body(self):
        """
        Attach the HTML which can be used as the body for the email
        :return boolean:
        """
        if os.path.exists(self.unique_file):
            body_as_html = MIMEText(self.get_html_body(), 'html')
            self.message.attach(body_as_html)
            return True
        else:
            logging.error('Could not attach html body, the following file: "%s" cannot be found.' % self.unique_file)
            return False

    def send_email(self):
        """
        Send the email.
        """
        text = self.message.as_string()
        to_address = self.recipients
        self.server.sendmail(FROM_EMAIL_ADDRESS, to_address, text)
        self.server.quit()

def remove_file(home_directory, identifier):
    """
    Remove the HTML file. Clean up for the docker container.
    :param home_directory:
    :param identifier:
    """
    os.remove('%semail-content-%s.html' % (home_directory, identifier))

def determine_home_directory():
    """
    Determines home directory based on what environment its running on
    :return home directory
    """
    if os.path.exists('/usr/src/app/'):
        return '/usr/src/app/'
    else:
        return './'

def revert_uniquify(home_directory, identifier):
    """
    Reverts the uniquified email content file name.
    :param home_directory:
    :param identifier:
    """
    unique_file = '%semail-content-%s.html' % (home_directory, identifier)
    if os.path.exists(unique_file):
        os.rename(unique_file, '%semail-content.html' % home_directory)
        return True
    else:
        logging.error('No uniquified "email-content-%s.html" file present to revert.' % identifier)
        return False

def generate_random_string(size=8, chars=string.ascii_uppercase + string.digits):
    """
    Function used to generate a random string to make email-content file unique.
    :param size:
    :param chars:
    """
    return ''.join(random.choice(chars) for x in range(size))

def parse_args():
    """
    Function used to parse the arguments passed in
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('-s', '--subject',
    help="Subject for the email",
    required=True)
    parser.add_argument('-r', '--recipients',
    help="Recipients we want to send email to",
    required=True)
    return parser.parse_args()

def email_retry(max_retry):
    """
    Retry wrapper function that takes in an AMTMailer right before
    the intended mailer.send_email() to retry any failures in sending.
    :param max_retry:
    """
    for send_attempt in range(1, max_retry+1):
        parsed_args = parse_args()
        identifier = generate_random_string()
        home_directory = determine_home_directory()
        try:
            mailer = AMTMailer(parsed_args.recipients, parsed_args.subject, identifier, home_directory)
            uniquified = mailer.uniquify_email_content()
            html_attached = mailer.attach_html_body()
            if uniquified and html_attached:
                mailer.attach_logo()
                mailer.send_email()
                remove_file(home_directory, identifier)
                break
            else:
                logging.error('Could not even attempt to send email: uniquified=%s, html_attached=%s' % (uniquified, html_attached))
        except socket.error as socket_error:
            logging.warning("Attempt %d to send email failed..." % send_attempt)
            logging.error(socket_error)
            if send_attempt >= max_retry:
                logging.error("Could not send email after %d attempts." % max_retry)
                remove_file(home_directory, identifier)
            else:
                revert_uniquify(home_directory, identifier)

if __name__ == "__main__":
    email_retry(5)
