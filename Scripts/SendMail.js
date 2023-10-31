import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import requests


def send_submitter_email():
    email_addresses = ["thismail.raja@gmail.com"]
    # email_addresses = ["thismail.raja@gmail.com", "hasanalid@gmail.com"]

    #    # Fetch the HTML template content from a URL
    template_url = "https://fmbmississauga.github.io/fmb/template1.html"
    response = requests.get(template_url)

    if response.status_code == 200:
        html_template = response.text
    else:
        print("Failed to fetch the HTML template from the URL.")
        return

    # Create an SMTP session
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "fmb@mississaugajamaat.com"
    smtp_password = ""

    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    # Sending Email
    for email_address in email_addresses:
        msg = MIMEMultipart()
        msg["From"] = smtp_username
        msg["To"] = email_address
        msg["Subject"] = "Registration for Moula (TUS) Milaad Niyaaz Thaali"

        # Attach the HTML content to the email body
        msg.attach(MIMEText(html_template, "html"))

        server.sendmail(smtp_username, email_address, msg.as_string())

    # Quit the SMTP server
    server.quit()


# Usage

send_submitter_email()
