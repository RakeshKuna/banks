#!/bin/sh -eu
./generate_config_js.sh >/usr/share/nginx/html/env-config.js
nginx -g "daemon off;"