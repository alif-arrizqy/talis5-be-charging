FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --silent

RUN npm install -g typescript

COPY . /usr/src/app

# Generate Prisma Client
RUN npx prisma generate

# Generate Prisma Schme
RUN npx prisma migrate dev --name init

# Build the app
RUN npm run build

CMD ["npm", "run", "start"]