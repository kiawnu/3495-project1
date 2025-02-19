# Use official Node.js image
FROM node:18-alpine

RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

COPY ../scripts/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose port
EXPOSE 3300

# Start the server
CMD ["wait-for-it.sh", "mongodb:27017", "--", "node", "app.js"]
