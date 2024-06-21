# utils.py
import requests

def send_email(to_email, subject, content):
    formspree_url = 'https://formspree.io/f/xnqekbra'
    data = {
        'email': to_email,
        'subject': subject,
        'message': content,
    }
    try:
        response = requests.post(formspree_url, data=data)
        response.raise_for_status()
        print(f'Email sent successfully to {to_email}')
    except requests.exceptions.RequestException as e:
        print(f'Error sending email to {to_email}: {e}')
