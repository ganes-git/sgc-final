# Use official Node.js image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start command
CMD [ "node", "app.js" ]
