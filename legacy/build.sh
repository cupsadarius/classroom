#!/bin/bash

# build all containers first
docker-compose -p classroom -f ./docker-compose.yml build