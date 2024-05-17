FROM node:lts-alpine

# Set the environment to production
ENV NODE_ENV=production

# Create a working directory
WORKDIR /usr/src/app

# Copy all files to the working directory
COPY . .

# Install dependencies
RUN npm install --silent

# Generate Prisma Client
RUN npx prisma generate

# Generate Prisma Schme
# RUN npx prisma migrate dev --name init
RUN npx prisma migrate deploy

# Build the app
RUN npm run build

CMD ["npm", "run", "start"]