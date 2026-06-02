FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    bluez \
    dbus \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY scanner.py .

CMD ["python3", "-u", "scanner.py"]