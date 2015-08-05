Template.webcam.onRendered(function () {
  // A ver
  //
});

Template.webcam.onCreated( function () {
  // A ver

});


Template.webcam.helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  },
});

Template.webcam.events({
  'click #start-webcam': function () {
    MeteorCamera.getPicture({
      width: 640,
      height: 480,
      quality: 80,
    }, function (err, data) {
      if(err) { 
        console.log(err);
      } else {
        console.log(data);
        var webcamImage = document.getElementById('webcam-img');

        webcamImage.src = data; 

        var colorThief = new ColorThief.colorRob();

        paletteArray = colorThief.getPalette(webcamImage,2);
        console.log(paletteArray);

        var result = false;

        for(var i = 0; i < paletteArray.length; i++) {
          if( isNeighborColor([255, 51, 153,], paletteArray[i], 88) ) {
            result = true;
            break;
          }
        }

        console.log(result);
        document.getElementById('result').innerHTML = result;
      }
    });
  }, 
});

function isNeighborColor(color1, color2, tolerance) {
  if(tolerance == undefined) {
    tolerance = 32;
  }

  return Math.abs(color1[0] - color2[0]) <= tolerance
  && Math.abs(color1[1] - color2[1]) <= tolerance
  && Math.abs(color1[2] - color2[2]) <= tolerance;
}
