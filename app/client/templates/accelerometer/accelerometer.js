var accel = null;

Template.accelerometer.onRendered(function () {
  $('.lineChart').css('width', window.innerWidth);
  $('.lineChart').css('height', window.innerHeight * 0.8);
});

Template.accelerometer.onCreated( function () {

  accel = {
    record: [],
    data: {
      x: [],
      y: [],
      z: [],
    },
    axis: ['x'],
    baseData: {
      x: [],
      y: [],
      z: [],
    },
    pushRecord: function(event) {
      // _this is different here because the scope comes from window
      var _this = accel;

      _this.record.push(event);
    },
    plot: function(ctxId) {

      var _this = this;
      var axis = _this.axis;
      var ctx = document.getElementById(ctxId).getContext("2d"); 
      var dataToPlot;
      
      if( ctxId === 'baseChart' ) {
        dataToPlot = _this.baseData;
      } else if ( ctxId === 'testChart' ) {
        dataToPlot = _this.data;
      }

      // Plot options
      var plotOptions = {
        pointDot: false,
        datasetFill: false,
        bezierCurve: false,
      };

      // Build data
      var accelLabels = [];

      for(var i = 0; i < dataToPlot[axis[0]].length; i++) {
        accelLabels.push(i);
      }

      var accelData = {
        labels: accelLabels,
        datasets: [],
      };

      for ( var i = 0; i < axis.length; i++ ) {

        accelData.datasets.push({
          label: axis[i],
          data: dataToPlot[axis[i]],
          strokeColor: _this.randomColorGenerator(),
        });

      }

      // Plot data
      var accelChart =  new Chart(ctx).Line(accelData, plotOptions);
    },
    start: function() {
      var _this = this;

      // Clear record
      _this.record = [];

    },
    end: function() {
      var _this = this;

      _this.data = {
        x: [],
        y: [],
        z: [],
      };
      // Put each axis on its own array
      for(var i = 0; i < _this.record.length; i++) {
        for( var x = 0; x < _this.axis.length; x++ ) {
          _this.data[_this.axis[x]].push(_this.record[i].accelerationIncludingGravity[_this.axis[x]]); 
        }
      }

      _this.plot('testChart');

    },
    endBase: function() {
      var _this = this;

      _this.baseData = {
        x: [],
        y: [],
        z: [],
      };
      // Put each axis on its own array
      for(var i = 0; i < _this.record.length; i++) {
        for( var x = 0; x < _this.axis.length; x++ ) {
          _this.baseData[_this.axis[x]].push(_this.record[i].accelerationIncludingGravity[_this.axis[x]]); 
        }
      }

      _this.plot('baseChart');

    },
    compare: function() {
      var _this = this;
      var dtw = new DTW();

      $('.comparison-result span').html('');
      for( var x = 0; x < _this.axis.length; x++ ) {
        var comparison = dtw.compute(_this.baseData[_this.axis[x]], _this.data[_this.axis[x]]);
        document.querySelector('#comparison-' + _this.axis[x] + ' span').innerHTML = comparison;
      }
    },
    randomColorGenerator: function () { 
      return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
    },
  };
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
  'change input[type="checkbox"]': function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked'); 
    var checkedAxis = [];
    for(var i = 0; i < checkboxes.length; i++) {
      checkedAxis.push(checkboxes[i].value)
    }

    accel.axis = checkedAxis;
  },
  'click #accel-base-start': function () {
    // Bind event
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', accel.pushRecord, false);
    }
    accel.start();
  },
  'click #accel-base-stop': function () {
    // Unbind event
    window.removeEventListener('devicemotion', accel.pushRecord );

    accel.endBase();
  },
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
  'click #compare': function () {
    accel.compare();
  },
})
