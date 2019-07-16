#!/bin/sh -eu
if [ -z "${BANK_MICROSERVICE:-}" ]; then
    BRAND_JSON=undefined
else
    BRAND_JSON=$(jq -n --arg brand '$BANK_MICROSERVICE' '$bank_microservice')
fi
if [ -z "${AGENT_MICROSERVICE:-}" ]; then
    COUNTRY_JSON=undefined
else
    COUNTRY_JSON=$(jq -n --arg country '$AGENT_MICROSERVICE' '$agent_microservice')
fi
 
cat <<EOF
window._env_.BANK_MICROSERVICE=$BRAND_JSON;
window._env_.AGENT_MICROSERVICE=$COUNTRY_JSON;
EOF