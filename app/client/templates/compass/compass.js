Template.compass.onRendered(function () {

});

Template.compass.onCreated( function () {
  // A ver
  GoogleMaps.ready('exampleMap', function(map) {
    Compass.init();
  });
});


Template.compass.helpers({
  isLoggedIn: function () {
    return !!Meteor.user();
  },
  mapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(19.409714299999997, -99.1629845),
        zoom: 15,
      };
    }
  },
});

Template.compass.events({
});

var Compass = {
  watchId: null,
  destiny: {
    lat: null,
    lng: null,
  },
  position: {
    lat: null,
    lng: null,
  },
  positionMarker: null,
  compensationAngle: null,
  minDistance: 0.0009, // in rad?
  maxDistance: 0.005, // in rad?
  distanceRatio: 300, // in Km
  getDistance: function(pointA, pointB) {
    var _this = this;

    var xs = 0;
    var ys = 0;

    xs = pointB.lng - pointA.lng;
    xs = xs * xs;

    ys = pointB.lat - pointA.lat;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  },
  getDistanceInKm: function(pointA, pointB) {
    var _this = this;

    var R = 6371; // Radius of the earth in km
    var dLat = _this.deg2rad(pointB.lat-pointA.lat);
    var dLon = _this.deg2rad(pointB.lng-pointA.lng); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(_this.deg2rad(pointA.lat)) * Math.cos(_this.deg2rad(pointB.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  },
  deg2rad: function(deg) {
    return deg * (Math.PI/180)
  },
  rad2deg: function(rad) {
    return rad * 57.29577951308232;
  },
  getRandomDistance: function(min, max) {
    // Positive or negative?
    var way = Math.random() >= 0.5;
    if( way ) {
      max = max * -1;
      min = min * -1;
    }
    return Math.random() * (max - min) + min;
  },
  /*
  getAngle: function(pointA, pointB) {
   return Math.atan2(pointB.lng - pointA.lng, pointB.lat - pointA.lat) * 180 / Math.PI;
  },
  */
  getAngle: function( pointA, pointB, pointC ) {
    var _this = this;
    var AB = Math.sqrt(Math.pow(pointB.lng-pointA.lng,2)+ Math.pow(pointB.lat-pointA.lat,2));    
    var BC = Math.sqrt(Math.pow(pointB.lng-pointC.lng,2)+ Math.pow(pointB.lat-pointC.lat,2)); 
    var AC = Math.sqrt(Math.pow(pointC.lng-pointA.lng,2)+ Math.pow(pointC.lat-pointA.lat,2));
    return _this.rad2deg(Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)));
  },
  setPosition: function(position) {
    var _this = this;

    _this.position = position;

    // Add position marker
    if( _this.positionMarker === null ) {
      _this.positionMarker = new google.maps.Marker({
        position: new google.maps.LatLng(_this.position.lat, _this.position.lng),
        map: GoogleMaps.maps.exampleMap.instance,
        title: 'Position!'
      });
    } else {
      var newLocation = new google.maps.LatLng(_this.position.lat, _this.position.lng);
      _this.positionMarker.setPosition( newLocation );
      GoogleMaps.maps.exampleMap.instance.panTo( newLocation );
    }

    document.getElementById('actual-location').innerHTML = _this.position.lat + ", " + _this.position.lng;

    // Check distance in Km between position and destiny
    var distance = _this.getDistanceInKm( _this.position, _this.destiny );

    document.getElementById('distance').innerHTML = distance;

    if( distance < 0.3 ) {
      document.getElementById('compass').classList.add('green');
    } else {
      document.getElementById('compass').classList.remove('green');
    }

  },
  startGeoWatchers: function () {
    var _this = this;

    // Start geolocation watch
    _this.watchId = navigator.geolocation.watchPosition( function(position) {
      _this.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });

    // Start orientation compass
    window.addEventListener('deviceorientation', function(eventData) {

      // Generate reference north point
      var distance = _this.getDistance( _this.position, _this.destiny, true);   
      var reference = {
        lat: _this.position.lat + distance,
        lng: _this.position.lng,
      };

      // Get compensation angle
      _this.compensationAngle = _this.getAngle( reference, _this.position, _this.destiny);

      var dir = eventData.alpha - _this.compensationAngle;
      var rotation = "rotate(" + dir + "deg)";
      document.getElementById('compass').style.WebkitTransform = rotation;
      document.getElementById('compass').style.msTransform = rotation;
      document.getElementById('compass').style.transform = rotation;
    });
  },
  stop: function() {
    var _this = this;

    navigator.geolocation.clearWatch( _this.watchId );
  },
  init: function() {
    var _this = this;

    // Check for geolocation and orientation availability
    if (navigator.geolocation && window.DeviceOrientationEvent) {

      // Set initial position
      navigator.geolocation.getCurrentPosition( function(position) {

        // Generate random destiny
        _this.destiny.lat = position.coords.latitude + _this.getRandomDistance(_this.minDistance,_this.maxDistance);
        _this.destiny.lng = position.coords.longitude + _this.getRandomDistance(_this.minDistance,_this.maxDistance);

        document.getElementById('destiny-location').innerHTML = _this.destiny.lat + ", " + _this.destiny.lng;

        // Add destiny marker
        var destiny = new google.maps.LatLng(_this.destiny.lat, _this.destiny.lng);
        var destinyMarker = new google.maps.Marker({
          position: destiny,
          map: GoogleMaps.maps.exampleMap.instance,
          title: 'Destiny!'
        });

        // Set current position
        _this.setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });


        // Start orientation and position watchers
        _this.startGeoWatchers();

      });

    } else {
      console.log(':(');
    }
  },
};
