from requests import post
from json import dumps
from time import sleep
from os import environ
import arrow

timezone = 'Europe/Paris'

def now():
    """
    Return the current date with the correct timezone
    """
    return arrow.now(timezone)

def log(message):
    print('[{}] {}'.format(now().format('YYYY-MM-DD HH:mm:ss'), message))

if 'SLACK_CHANNEL' not in environ or 'SLACK_BOT_TOKEN' not in environ or 'SEND_HOUR' not in environ:
    log('Missing environments variables')
    exit(1)

slack_channel = environ['SLACK_CHANNEL']
slack_bot_token = environ['SLACK_BOT_TOKEN']
send_hour = environ['SEND_HOUR']

jokes = ['']

with open('jokes.txt', 'r', encoding='utf8') as file:
    i = 0

    # Parse the file in an array
    for line in file.readlines():
        if line == '\n':
            jokes.append('')
            i += 1
        else:
            jokes[i] += line

    file.close()

# Removes the last \n for each jokes
jokes = [blague[:-1] for blague in jokes]

for i, joke in enumerate(jokes):
    if len(joke) == 0:
        log("A joke is empty ! Or unexpected token. Stopped at {}. Joke before:\n{}".format(i, jokes[i - 1]))
        exit(1)

log('Bigard bot !')
log('There are {} jokes available'.format(len(jokes)))
log('Scheduled to send a joke every day at {}. Timezone {}'.format(send_hour, timezone))

def current_hour():
    """
    Returns the current time with the correct timezone
    """
    return now().format('HH:mm')

def current_day():
    """
    Returns the current day (from the begenning of the year from 1 to 366
    """
    return int(now().format('DDD'))

def send_joke():
    joke_index = current_day() % len(jokes)
    joke = jokes[joke_index]

    formatted_data = {'token': slack_bot_token, 'channel': slack_channel, 'text': joke}

    response = post("https://slack.com/api/chat.postMessage", data=formatted_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
    print(response.__dict__)

    log('Sent joke {} - Response {}'.format(joke_index, response.status_code))

# Checks every minutes if it's time to send a message
while True:
    if send_hour == current_hour():
        send_joke()

    # Sleeps until the next minute  and zero seconds
    sleep_time = 60 - int(now().format('ss'))
    sleep(sleep_time)
