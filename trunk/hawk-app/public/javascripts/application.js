(function($) {
    // ready
    function displayMessage(message, element) {
        $('#stream_instance_tmpl').tmpl(message).prependTo(element);
    };
                
    function displayError(message, element) {
        $('#stream_error_tmpl').tmpl(message).prependTo(element);  
    };
    
    var client = new Faye.Client('/faye');
            
    client.subscribe('/instances', function(message) {
        console.log(message.text.name + " - " + message.text.state);
        displayMessage(message.text, '#stream_messages');
    });
                
    client.subscribe('/errors', function(message) {
        console.log(message.text.errorLine);
        displayError(message.text, '#stream_messages');
    });
                
    client.subscribe('/heartbeats', function(message) {
        console.log(message.text);
        $('#heartbeats').text(message.text);
    });
                
    $('#querysearchform').submit(function(data) {
                    
        var self = $(this);
        var instanceId = $('#querysearchform > #instanceid').val();
        console.log("Searching events for " + instanceId);
                    
        $.get("/instances/" + instanceId, function(json) {
            $('#query_messages').children().remove().end();
            displayMessage(json, '#query_messages');
	    });
                    
        return false;
    });
                
    $('.instancelink').live('click', function(e) {
        e.preventDefault();
       var self = $(this);
       $('#instanceid').val(self.text());
       $('#querysearchform').submit();
    });
    
})(jQuery);