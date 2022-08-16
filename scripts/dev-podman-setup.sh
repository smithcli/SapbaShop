#!/bin/bash

# This script is to quickly get the app running for development using podman.
APP_NAME="SapbaShop"
APP_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && cd .. && pwd)
APP_NETWORK=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]')
APP_DB_NAME="$APP_NETWORK-db"
APP_CON_NAME="$APP_NETWORK-app"

check_for_podman() {
  if ! command -v podman &> /dev/null
  then
    echo "This script requires podman. Please install podman or add to PATH to use this script."
    exit
  fi
}

build_network() {
  podman network exists $APP_NETWORK
  if [[ $(echo $?) == 1 ]]; then
    echo "$APP_NAME network doesnt exist... creating"
    local network=$(podman network create $APP_NETWORK) || exit $?
    if [[ $(echo $network) == "$APP_NETWORK" ]]; then
      echo -e "\u2714 podman network $network created!"
    else
      echo -e "\u274c something went wrong while creating network $network"
    fi
  else
    echo -e "\u2714 $APP_NAME network exists!"
  fi
}

# Expose 27017 for Compass and network for the app
build_database() {
  podman container exists $APP_DB_NAME
  if [[ $(echo $?) == 1 ]]; then
    echo "  $APP_NAME database doesnt exist... creating"
    local db_con=$(
      podman run -d \
        --name $APP_DB_NAME \
        --network $APP_NETWORK \
        -p 27017:27017 \
        docker.io/library/mongo:5
    ) || exit $?
    sleep 2
    podman container exists $APP_DB_NAME
    if [[ $(echo $?) == 0 ]]; then
      echo -e "\u2714 $APP_NAME database container created!"
    else
      echo -e "\u274c something might have went wrong while creating $APP_DB_NAME container: "
      echo $db_con
      exit 1
    fi
  else
    echo -e "\u2714 $APP_DB_NAME exists! Starting container"
    podman start $APP_DB_NAME
  fi
}

# Expose 8000 for API access
build_nodeapp() {
  podman container exists $APP_CON_NAME
  if [[ $(echo $?) == 1 ]]; then
    echo "  $APP_NAME app doesnt exist... creating"
    podman run -it \
      --name $APP_CON_NAME \
      --network $APP_NETWORK \
      -p 8000:8000 \
      -v $APP_DIR:/opt/$APP_NAME:z \
      -w /opt/$APP_NAME \
      docker.io/library/node:16 bash
  else
    echo -e "\u2714 $APP_CON_NAME exists! Starting container"
    podman start -ia $APP_CON_NAME
  fi
}

check_for_podman
build_network
build_database
build_nodeapp
