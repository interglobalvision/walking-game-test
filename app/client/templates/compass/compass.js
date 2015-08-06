var Compass = {
  
};
Template.compass.onRendered(function () {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(eventData) {

      var dir = eventData.alpha;
      var rotation = "rotate(" + dir + "deg)";
      document.getElementById('compass').style.WebkitTransform = rotation;
      document.getElementById('compass').style.msTransform = rotation;
      document.getElementById('compass').style.transform = rotation;
    });
  } else {
    console.log(':(');
  }
});

Template.compass.onCreated( function () {
  // A ver

});


Template.compass.helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  },
});

Template.compass.events({
});
