Template.soundLevel.onRendered(function () {
});

Template.soundLevel.onCreated( function () {
});


Template.soundLevel.helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  }
})

Template.soundLevel.events({
  'click #start-sound': function () {
    if( hasGetUserMedia() ) {
      
      // Set global vars for audioContext and getUserMedia
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

      // Create new aduio context
      var context = new AudioContext();

      // Get audio input. This triggers the allow/deny dialog
      navigator.getUserMedia({audio: true}, function(stream) {

        // Set Audio nodes
        var microphone = context.createMediaStreamSource(stream);
        var analyser = context.createScriptProcessor(1024,1,1);


        // microphone -> filter -> destination.
        microphone.connect(analyser);
        analyser.connect(context.destination);

        // Set the process that measures audio level
        analyser.onaudioprocess = function(e){
          var out = e.outputBuffer.getChannelData(0);
          var int = e.inputBuffer.getChannelData(0);
          var max = 0;

          for(var i = 0; i < int.length; i++){
            out[i] = 0;//prevent feedback and we only need the input data
            max = int[i] > max ? int[i] : max;
          }

          // Convert from magitude to decibel / could be useful
          //var db = 20*Math.log(Math.max(max,Math.pow(10,-72/20)))/Math.LN10;
          
          document.getElementById('meter').style.width = max * 100 + "%";

          if( max > 0.9 ) { 
            document.getElementById('meter').style.background = "red";
          } else if( max > 0.8 ) { 
            document.getElementById('meter').style.background = "yellow";
          } else {
            document.getElementById('meter').style.background = "green";
          }

        }

      }, function(e) {
        console.log(e);
      });
    } else {
      alert(":(");
    }
  },
})

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
