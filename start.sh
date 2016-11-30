#!/bin/bash

export MAIN_DOMAIN="classroom.dkr"

docker-compose -p classroom -f ./docker-compose.yml up -d
