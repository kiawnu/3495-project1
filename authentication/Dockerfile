# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .


# Expose port
EXPOSE 3200

# Start the server
CMD ["node", "app.js"]