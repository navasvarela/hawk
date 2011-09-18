#!/bin/bash

INSTANCEURL="http://localhost:3000/instances"

echo "Starting express application"
node app.js & disown
sleep 2
echo ""
echo "Getting all instances"
curl -i -X GET $INSTANCEURL/i-8212
sleep 2
echo ""
echo "Creating a new instance"
curl -i -X POST -d @ni.json -H "Content-Type: application/json" $INSTANCEURL
echo ""
echo "Updating an instance"
curl -i -X PUT -d @iu.json -H "Content-Type: application/json" $INSTANCEURL
sleep 2
echo ""
echo "Killing all node processes"
ps -ef | grep app.js | grep -v 'grep.app.js' | awk '{print $2}' | xargs kill -9

