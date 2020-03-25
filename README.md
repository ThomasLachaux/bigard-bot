# Bigard Bot
A slack bot that sends a joke every day

## Installation
```
pip3 install -r requirements.txt
```

## Start script
You must start the script with environment variables
- **WEBHOOK**: The webhook url
- **SEND_HOUR**: The hour to send every day (eg: 09:00, 10:00, 13:00...)
- **SERVICE**: The service name (discord or slack)
```
WEBHOOK=<webhook-url> SEND_HOUR="10:00" SERVICE="slack" python3 app.py
```