Template.webcam.onRendered(function () {
});

Template.webcam.onCreated( function () {
});


Template.webcam.helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  }
})

Template.webcam.events({
  'click #start-webcam': function () {
    MeteorCamera.getPicture({
      width: 640,
      height: 480,
      quality: 80
    }, function (err, data) {
      if(err) { 
        console.log(err);
      } else {
        console.log(data);
        document.getElementById('webcam-img').src = data; 
      }
    });
  } 
});

