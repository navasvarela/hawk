#!/usr/bin/perl

use URI::Escape;

my $debug=0;

print "Running harrier\n";

sub process {
   ($commandline) = @_;
   ($debug) ? print $commandline : system $commandline;
    print "\n";
}

while (<>) {

   my $url = 'http://109.144.10.52:3000';
   my $content_type = "Content-Type: application/json";
   my $vm_container = "vm-container";
   my $log_timestamp = "00000000000000";
   my $line = uri_escape($_);

   # get vm-container and log timestamp
   if (/^(vm-container-\d{1,}-\d{1,})\:\s(\S+\s\S+).*$/) {
      $vm_container = $1;
      $log_timestamp = $2;
   }

   if (/ERROR/) {
      my $post = qq|'{"vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp", "errorLine": "$line"}' -H |
               . qq|"$content_type" $url/errors|;

      &process("curl -v -i -X POST -d $post");      
   }

   if (/RunInstancesServiceHelper.runInstances.*Requesting.new.Instance.*instanceId=(.{10}).*$/) {
      my $instance = $1;
      my $post = qq|'{"name":"$instance", "state":"api request received", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;

      &process("curl -v -i -X PUT -d $post");
   }
   if (/Received.RUN_INSTANCE.*instanceIds=\[(.*)\]/) {
      my $instance = $1;
      my $post = qq|'{"name":"$instance", "state":"anycast received by instance manager", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;

      &process("curl -v -i -X PUT -d $post");
   }
   if (/InstanceNetworkSetupHandler.handle.*instanceId=(\S{10}).*$/) {
       my $instance = $1;
       
       my $post = qq|'{"name":"$instance", "state":"received message in network manager", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;
    
       &process("curl -v -i -X PUT -d $post");
   }
   if (/LibvirtManager.startInstance.*instance.(\S{10}).*$/) {
       my $instance = $1;
       
       my $post = qq|'{"name":"$instance", "state":"started instance", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;
    
       &process("curl -v -i -X PUT -d $post");
   }
   if (/DeliverHandler.terminateInstance.*Instance:(.*)$/) {
      my $instance = $1;
      my $post = qq|'{"name":"$instance", "state":"terminated request received by instance manager", "vmcontainer": "$vm_container", "logtimestamp": "$log_timestamp"}' -H |
               . qq|"$content_type" $url/instances/$instance|;

      &process("curl -v -i -X PUT -d $post");
   }

}
