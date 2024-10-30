FROM node:20

WORKDIR /nestjs-unit-test

COPY package*.json ./

RUN npm ci


COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:dev"]