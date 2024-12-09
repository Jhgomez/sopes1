# We're going to use an image based on python with Alpine(Linux)
FROM python:3.11-alpine

# Stablish work directories
WORKDIR /app

# Copy files to a work directory
COPY requirements.txt requirements.txt
COPY app.py app.py

# Install dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev && \
    pip install --no-cache-dir -r requirements.txt

# Expose custom port
EXPOSE 8000

# Execute application
CMD ["python", "app.py"]