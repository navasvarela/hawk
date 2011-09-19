#!/bin/bash

perl -alne 'if (/Received.RUN_INSTANCE.*instanceIds=\[(.*)\]/) { system "curl -v -i -X POST -d \047{\"name\":\"(\", \"state\":\"created\"}\047 -H \"Content-Type: application/json\" http://109.144.10.52:3000/instances" };')
