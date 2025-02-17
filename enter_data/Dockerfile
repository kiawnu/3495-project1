# Use official Node.js image
FROM node:18-alpine

RUN apk add --no-cache mysql-client bash

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
EXPOSE 3000

# Start the server
CMD ["wait-for-it.sh", "mysql:3306", "--", "node", "app.js"]
