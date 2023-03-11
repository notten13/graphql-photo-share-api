FROM node:10

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./src ./src

EXPOSE 3000

CMD [ "yarn", "start" ]
