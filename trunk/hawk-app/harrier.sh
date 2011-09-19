#!/bin/bash

# post test
# 2011-09-19 20:33:00,786 DEBUG [10.19.127.253.4524][AnycastHandler.handleAnycast() 73] [a3365994-bb18-4078-bbb2-4043693543a4] - Received RUN_INSTANCE message on RUN_INSTANCE topic. Instance: [userId=robustnessbuild,securityGroupName=4_1316464324703,platform=null,sourceImagePath=null,sourceKernelPath=null,sourceRamdiskPath=null,keyName=null,ramdiskId=null,kernelId=pki-7b661177,imageId=pmi-f2697fc3,additionalInfo=null,userData=null,instanceType=m1.small,availabilityZone=cube1-1a,blockDeviceMapping=[],monitoring=false],instanceIds=[i-000FY6ia],maxCount=1,minCount=1
# delete test
# 2011-09-19 23:24:26,685 DEBUG [10.19.127.251.4524][DeliverHandler.terminateInstance() 131] [1cfe2e19-4ff2-4da3-a702-41564d82cf84] - Terminating Instance:i-000Ahzit
perl -alne 'if (/Received.RUN_INSTANCE.*instanceIds=\[(.*)\]/) { system "curl -v -i -X POST -d \047{\"name\":\"$1\", \"state\":\"created\"}\047 -H \"Content-Type: application/json\" http://109.144.10.52:3000/instances" };if (/DeliverHandler.terminateInstance.*Instance:(.*)$/) { print "curl -v -i -X PUT -d \047{\"name\":\"$1\", \"state\":\"terminated\"}\047 -H \"Content-Type: application/json\" http://109.144.10.52:3000/instances" }; '
