#!/bin/bash

URL="http://localhost:3000"

echo "--------------------------------------------------------------------------"
echo "Starting express application"
node app.js & disown
sleep 2
echo "--------------------------------------------------------------------------"
echo "Testing /properties"
echo "Adding hostname property"
curl -X POST -d '{"hostname": "fr001.baynard.cloud21cn.com"}' -H "Content-Type: application/json" $URL/properties
echo "" 
echo "Getting hostname property"
curl -X GET $URL/properties/hostname
echo "" 
sleep 2
echo "--------------------------------------------------------------------------"
echo "Testing /instances"
curl -X PUT -d '{"name":"i-0009Xafp", "state":"api request received", "context": "API Manager", "vmcontainer": "vm-container-0-1", "logtimestamp": "2011-09-20 17:33:16,703"}' -H "Content-Type: application/json" $URL/instances/i-0009Xafp
echo ""
curl -X PUT -d '{"name":"i-000FY6ia", "state":"anycast received by instance manager", "context": "Instance Manager", "vmcontainer": "vm-container-0-10", "logtimestamp": "2011-09-19 20:33:00,786"}' -H "Content-Type: application/json" $URL/instances/i-000FY6ia
echo ""
curl -X PUT -d '{"name":"i-0000Guyk", "state":"received message in network manager", "context": "Network Manager", "vmcontainer": "vm-container-0-11", "logtimestamp": "2011-09-18 15:03:09,305"}' -H "Content-Type: application/json" $URL/instances/i-0000Guyk
echo ""
curl -X PUT -d '{"name":"i-000Dyggb", "state":"started instance", "context": "Instance Manager", "vmcontainer": "vm-container-0-14", "logtimestamp": "2011-09-20 20:32:33,746"}' -H "Content-Type: application/json" $URL/instances/i-000Dyggb
echo ""
curl -X PUT -d '{"name":"i-000Ahzit", "state":"terminated request received by instance manager", "context": "Instance Manager", "vmcontainer": "vm-container-0-20", "logtimestamp": "2011-09-19 23:24:26,685"}' -H "Content-Type: application/json" $URL/instances/i-000Ahzit
echo ""
echo "--------------------------------------------------------------------------"
echo "Getting count of all instances"
curl -X GET $URL/instances/i-0009Xafp/count
sleep 2
echo "--------------------------------------------------------------------------"
echo "Testing /errors"
curl -X POST -d '{"vmcontainer": "vm-container-0-1", "logtimestamp": "2011-09-18 15:03:09,305", "errorLine": "A%20line%20with%20ERROR%0A"}' -H "Content-Type: application/json" $URL/errors
echo ""
curl -X GET $URL/errors
echo ""
echo "--------------------------------------------------------------------------"
echo "Killing all node express processes"
ps -ef | grep app.js | grep -v 'grep.app.js' | awk '{print $2}' | xargs kill -9
echo "--------------------------------------------------------------------------"

