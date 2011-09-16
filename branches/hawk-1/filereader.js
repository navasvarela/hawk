

module.exports  = {

  readLines: function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data, err) {

      if (err) {
        console.log("Error:" + err.message);
        return;
      }

      remaining += data;
      var index = remaining.indexOf('\n');

      while(index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index+1);

        func(line);

        index = remaining.indexOf('\n');
      }
    
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        func(line);
      }
    });
  }

};
