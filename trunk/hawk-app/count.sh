#!/bin/bash

INSTANCEURL="http://localhost:3000/instances"

echo "--------------------------------------------------------------------------"
echo "Starting express application"
node app.js & disown
sleep 2
echo "--------------------------------------------------------------------------"
echo "Getting count of all instances"
curl -i -X GET $INSTANCEURL/i-8212/count
sleep 2
echo "--------------------------------------------------------------------------"
echo "Killing all node processes"
ps -ef | grep app.js | grep -v 'grep.app.js' | awk '{print $2}' | xargs kill -9

