FROM node:7.5-slim
# Create app directory
RUN mkdir -p /usr/classroom/api
WORKDIR /usr/classroom/api

# Set environment vars
ENV APP_ENV development
ENV TZ Europe/Bucharest

ENV DB_HOST db.classroom
ENV DB_PORT 28015
ENV DB_NAME classroom
ENV PORT 80
ENV SECRET "snasdnadnfiaufnwiqnfyq394bfqiyefbiqw3bfqiw"

# Install app dependencies
COPY . /usr/classroom/api

RUN rm -rf node_modules

RUN rm -rf docs

RUN npm install

RUN npm run generate:docs

CMD [ "npm", "run", "-s", "start"]
