#!/bin/bash

# This script is to generate a self signed cert for development
APP_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && cd .. && pwd)
mkdir $APP_DIR/certs

openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

mv localhost.crt localhost.key certs/
