#!/usr/bin/perl

print "Running harrier\n";

while (<>) {

   my $url = 'http://109.144.10.52:3000';
   my $content_type = "Content-Type: application/json";
   my $vm_container = "vm-container";
   my $log_timestamp = "00000000000000";

   # get vm-container and log timestamp
   if (/^(vm-container-\d{1,}-\d{1,})\:\s(\S+\s\S+).*$/) {
      $vm_container = $1;
      $log_timestamp = $2;
   }

   if (/RunInstancesServiceHelper.runInstances.*Requesting.new.Instance.*instanceId=(.{10}).*$/) {
      my $instance = $1;
      my $post = qq|'{"name":"$instance", "state":"api request received", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances|;

      system "curl -v -i -X POST -d $post";
      print "\n";
   }
   if (/Received.RUN_INSTANCE.*instanceIds=\[(.*)\]/) {
      my $instance = $1;
      my $post = qq|'{"name":"$instance", "state":"anycast received by instance manager", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;

      system "curl -v -i -X PUT -d $post";
      print "\n";
   }
   if (/InstanceNetworkSetupHandler.handle.*instanceId=(\S{10}).*$/) {
       my $instance = $1;
       
       my $post = qq|'{"name":"$instance", "state":"received message in network manager", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;
    
       system "curl -v -i -X PUT -d $post";
       print "\n";
   }
   if (/LibvirtManager.startInstance.*instance.(\S{10}).*$/) {
       my $instance = $1;
       
       my $post = qq|'{"name":"$instance", "state":"started instance", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;
    
       system "curl -v -i -X PUT -d $post";
       print "\n";       
   }
   if (/DeliverHandler.terminateInstance.*Instance:(.*)$/) {
      my $instance = $1;
      my $post = qq|'{"name":"$instance", "state":"terminated request received by instance manager", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;

      system "curl -v -i -X PUT -d $post";
      print "\n";
   }

}
