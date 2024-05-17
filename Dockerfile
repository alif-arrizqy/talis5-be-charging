FROM node:lts-alpine

# Set the environment to production
ENV NODE_ENV=production

# Create a working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Install typescript globally
RUN npm install -g typescript

# Install necessary type definitions
RUN npm install --save-dev @types/node @types/express @types/cors

# Copy all files to the working directory
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Apply Prisma migrations
RUN npx prisma migrate deploy

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "run", "start"]
