FROM node:7.3-slim
# Create app directory
RUN mkdir -p /usr/classroom/api
WORKDIR /usr/classroom/api
EXPOSE 3000

# Set environment vars
ENV APP_ENV development
ENV TZ Europe/Bucharest

ENV DB_HOST db.classroom.dkr
ENV DB_PORT 28015
ENV DB_NAME classroom
ENV PORT 80
ENV SECRET "snasdnadnfiaufnwiqnfyq394bfqiyefbiqw3bfqiw"

# Install app dependencies
COPY . /usr/classroom/api

RUN npm install

RUN ./node_modules/.bin/gulp build

CMD [ "npm", "run", "-s", "start"]
