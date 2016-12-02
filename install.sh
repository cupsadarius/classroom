#!/bin/bash

export MAIN_DOMAIN="classroom.dkr"
export SECRET="snasdnadnfiaufnwiqnfyq394bfqiyefbiqw3bfqiw"
# create project network
docker network create -d bridge classroom 2> /dev/null

# build all containers
./build.sh

# start all containers
./start.sh