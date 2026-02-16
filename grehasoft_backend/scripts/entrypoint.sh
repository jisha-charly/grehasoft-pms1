#!/bin/sh

# ==============================================================================
# Grehasoft PMS & CRM - Docker Entrypoint Script
# ==============================================================================

# Exit immediately if a command exits with a non-zero status.
set -e

# 1. Wait for MySQL to be ready
# We use a small python snippet to check the connection to prevent the 
# Django app from crashing if the DB container is still initializing.
echo "Waiting for MySQL database..."

python << END
import sys
import mysql.connector
import os
import time

db_name = os.getenv('DB_NAME')
user = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
host = os.getenv('DB_HOST')
port = os.getenv('DB_PORT', 3306)

max_retries = 30
while max_retries > 0:
    try:
        mysql.connector.connect(
            user=user,
            password=password,
            host=host,
            port=port,
            database=db_name
        )
        sys.exit(0)
    except mysql.connector.Error:
        time.sleep(1)
        max_retries -= 1

sys.exit(1)
END

echo "MySQL is up and running!"

# 2. Database Migrations
# Apply schema changes (Leads, Projects, Tasks, etc.)
echo "Applying database migrations..."
python manage.py migrate --noinput

# 3. Static Files
# Collect all admin and app static files for Nginx to serve
echo "Collecting static files..."
python manage.py collectstatic --noinput

# 4. Start Gunicorn
# --workers: (2 x num_cores) + 1. For a standard enterprise VPS, 3 is ideal.
# --threads: Handles concurrent I/O (File uploads in PMS).
# --timeout: 120s to allow for large file uploads/report generation.
echo "Starting Gunicorn server..."
exec gunicorn core.wsgi:application \
    --name grehasoft_api \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --threads 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info