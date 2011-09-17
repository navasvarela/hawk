node app.js & disown; sleep 2; curl -X POST -d @ni.json http://localhost:3000/instances; ps -ef | grep node | grep -v 'grep.node' | awk '{print $2}' | xargs kill -9
