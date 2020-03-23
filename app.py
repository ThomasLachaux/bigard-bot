from datetime import datetime
from requests import post
from json import dumps
from time import sleep
from os import environ
import schedule

if 'WEBHOOK' not in environ or 'SEND_HOUR' not in environ:
    print('Missing environments variables')
    exit(1)

webhook = environ['WEBHOOK']
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

print('Bigard bot !')
print('There are {} jokes available'.format(len(jokes)))
print('Scheduled to send a joke every day at {}'.format(send_hour))


def send_joke():
    # Gets the current day (from 1 to 366)
    now = int(datetime.now().strftime('%j'))
    joke_index = now % len(jokes)
    joke = jokes[joke_index]

    slack_data = {'text': joke}

    response = post(webhook, data=dumps(slack_data), headers={'Content-Type': 'application/json'})

    print('Day {}: Send joke {}. Status code: {}'.format(now, joke_index, response.status_code))


schedule.every().day.at(send_hour).do(send_joke)

# Checks every minutes if it's time to send a message
while True:
    schedule.run_pending()
    sleep(60)
