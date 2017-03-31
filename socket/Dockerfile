FROM node:7.5-slim
# Create app directory
RUN mkdir -p /usr/classroom/socket
WORKDIR /usr/classroom/socket

# Set environment vars
ENV APP_ENV development
ENV TZ Europe/Bucharest

ENV DB_HOST db.classroom
ENV DB_PORT 28015
ENV DB_NAME classroom
ENV PORT 80
ENV SECRET "snasdnadnfiaufnwiqnfyq394bfqiyefbiqw3bfqiw"

# Install app dependencies
COPY . /usr/classroom/socket

RUN rm -rf node_modules

RUN npm install

CMD [ "npm", "run", "-s", "start"]
