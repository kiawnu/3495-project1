FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

COPY scripts/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Start the server
CMD ["wait-for-it.sh", "mongodb:27017", "--", "wait-for-it.sh", "mysql:3306", "--", "python", "app.py"]
