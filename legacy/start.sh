#!/bin/bash

export MAIN_DOMAIN="classroom.dkr"
export SECRET="snasdnadnfiaufnwiqnfyq394bfqiyefbiqw3bfqiw"

docker-compose -p classroom -f ./docker-compose.yml up -d
