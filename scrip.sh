#!/bin/bash

case $1 in
    1)
        URL=172.104.32.111
        ;;
    2)
        URL=139.162.7.128
        ;;
    3)
        URL=139.162.1.126
        ;;
    4)
        URL=45.118.134.33
        ;;
    5)
        URL=172.104.36.108
        ;;
    6)
        URL=172.104.160.219
        ;;
    7)
        URL=172.104.180.235
        ;;
    8)
        URL=139.162.52.125
        ;;
    9)
        URL=139.162.2.168
        ;;
    10)
        URL=172.104.173.207
        ;;
    11)
        URL=139.162.33.167
        ;;
    12)
        URL=172.104.163.10
        ;;
    13)
        URL=139.162.41.194
        ;;
    14)
        URL=172.104.166.4
        ;;
    *)
        URL=$1
        ;;
esac

PORT=8008

if [ $# = 5 ]; then
    PORT=$5

while true; do
    echo "Send rate: $2 TXs per Batch, $3 Batchs per $4 second"
    echo "===========Sending transaction to SERVER ${1}============"
    REST_API="http://${URL}:${PORT}" TX=$2 BATCH=$3 node ./main.js
    sleep $4
done
