
# Base Image (Linux)

FROM python:3.11-slim

# Environment Variables

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


# Working Directory

WORKDIR /app

# System Dependencies

RUN apt-get update \
    && apt-get install -y gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Python Dependencies

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Project Files

COPY . .

# Expose Render Port

EXPOSE 10000

# Start Django via Gunicorn

CMD ["gunicorn", "django_backend.wsgi:application", "--bind", "0.0.0.0:10000"]
