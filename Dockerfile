# Use Node.js for development
FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files to the container
COPY . .

# Expose port 5173 for Vite
EXPOSE 5173

# Command to start the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
