FROM python:3.13.0a4-alpine

WORKDIR /opt

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

CMD python3 -u app.py