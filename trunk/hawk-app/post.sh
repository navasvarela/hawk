#!/bin/bash

INSTANCEURL="http://localhost:3000/instances"

#echo "--------------------------------------------------------------------------"
#echo "Starting express application"
#node app.js & disown
#sleep 2
echo "--------------------------------------------------------------------------"
echo "Creating 10 new instances"
for i in $(seq 1 10); do sed "s/instance/i-$i/g" ni.json > newinstance.json; curl -i -X POST -d @newinstance.json -H "Content-Type: application/json" http://localhost:3000/instances; sleep 10; done
echo "--------------------------------------------------------------------------"
echo "Killing all node processes"
ps -ef | grep app.js | grep -v 'grep.app.js' | awk '{print $2}' | xargs kill -9

