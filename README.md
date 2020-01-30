# Bigard Bot
A slack bot that sends a joke every day

## Installation
```
pip install -r requirements.txt
```

## Start script
You must start the script with environment variables
- The slack webhook url
- The hour to send every day (eg: 09:00, 10:00, 13:00...)
```
SLACK_WEBHOOK=<webhook-url> SEND_HOUR="10:00" python app.py
```