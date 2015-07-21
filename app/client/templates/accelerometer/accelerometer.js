var accel = {
  record: [],
  data: {
    x: [],
    y: [],
    z: [],
  },
  pushRecord: function(event) {
    // _this is different here because the scope comes from window
    var _this = accel;

    _this.record.push(event);
  },
  plot: function() {
    var _this = this;
    var ctx = document.getElementById('lineChart').getContext("2d"); 

    // Plot options
    var plotOptions = {
      pointDot: false,
      datasetFill: false,
      bezierCurve: false,
    };

    // Build data
    var accelLabels = [];

    for(var i = 0; i < _this.data.x.length; i++) {
      accelLabels.push(i);
    }

    var accelData = {
      labels: accelLabels,
      datasets: [
        {
          label: "X",
          data: _this.data.x,
          strokeColor: 'red',
        },
        {
          label: "Y",
          data: _this.data.y,
          strokeColor: 'blue',
        },
        {
          label: "Z",
          data: _this.data.z,
          strokeColor: 'green',
        },
      ],
    };

    // Plot data
    var accelChart =  new Chart(ctx).Line(accelData, plotOptions);
  },
  start: function() {
    var _this = this;

    // Clear record
    _this.record = [];
    _this.data = {
      x: [],
      y: [],
      z: [],
    };

  },
  end: function() {
    var _this = this;

    // Put each axis on its own array
    for(var i = 0; i < _this.record.length; i++) {
      _this.data.x.push(_this.record[i].accelerationIncludingGravity.x); 
      _this.data.y.push(_this.record[i].accelerationIncludingGravity.y); 
      _this.data.z.push(_this.record[i].accelerationIncludingGravity.z);
    }

    _this.plot();
  },
};

Template.accelerometer.onRendered(function () {
  $('#lineChart').css('width', window.innerWidth);
  $('#lineChart').css('height', window.innerHeight);
});

Template.accelerometer.helpers({
/*
  messages: function () {
    return Messages.find();
  },
*/
  isLoggedIn: function () {
    return !!Meteor.user();
  }
})

Template.accelerometer.events({
  'click #accel-start': function () {
    // Bind event
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', accel.pushRecord, false);
    }

    accel.start();
  },
  'click #accel-stop': function () {
    // Unbind event
    window.removeEventListener('devicemotion', accel.pushRecord );

    accel.end();
  },
})
