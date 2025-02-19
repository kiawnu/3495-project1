FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .


# Start the server
CMD ["python", "app.py"]
