FROM node:6.5-slim
# Create app directory
RUN mkdir -p /usr/classroom/api
WORKDIR /usr/classroom/api
EXPOSE 80

# Set environment vars
ENV APP_ENV development
ENV TZ Europe/Bucharest

ENV DB_HOST db.classroom.dkr
ENV DB_PORT 28015
ENV DB_NAME classroom
ENV PORT 80

# Install app dependencies
COPY package.json /usr/classroom/api/
RUN npm install

COPY . /usr/classroom/api

RUN ./node_modules/.bin/gulp build

CMD [ "npm", "run", "-s", "start"]
