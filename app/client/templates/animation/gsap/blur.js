Template.gsapBlur.onRendered(function () {
  function cssFilterTween(tl, filter, start, end){
    var units = ['px','deg','%'],
    tlp = (tl.progress()*100) >> 0;

    switch (filter) {
      case "blur":
        //filter = "blur";
        if (start < end){
          var inc = start + Math.abs(start - end)/100 * tlp; 

        } else {
          var inc = start - Math.abs(start - end)/100 * tlp; 

        }
        TweenMax.set(tl.target,{'-webkit-filter':'blur('+ inc + units[0]+')', 'filter':'blur('+ inc + units[0]+')'});
        break;

      case "hue-rotate":
        //filter = "hue-rotate"
        var tlp = (tl.progress()*100) >> 0;

        if (start < end){
          var inc = start + Math.abs(start - end)/100 * tlp; 

        } else {
          var inc = start - Math.abs(start - end)/100 * tlp; 

        }
        TweenMax.set(tl.target,{'-webkit-filter':'hue-rotate('+ inc + units[1]+')', 'filter':'hue-rotate('+ inc +units[1]+')'});
        break;

      default:
        //everything else is %
        var tlp = (tl.progress()*100) >> 0;

        if (start < end){
        var inc = start + Math.abs(start - end)/100 * tlp; 

        } else {
        var inc = start - Math.abs(start - end)/100 * tlp; 

        }
        TweenMax.set(tl.target,{'-webkit-filter':filter +'('+ inc + units[2]+')', 'filter':filter +'('+ inc +units[2]+')'});
    }
  }

  var showText = function (target, message, index, interval) {   
    if (index < message.length) {
      $('.text-box').show().append(message[index++]);
      setTimeout(function () { showText(target, message, index, interval); }, interval);
    } else {
      $('.text-box').append('<a class="close-text-box">&rarr;</a>');
    }
  }, wakeUp = "Hey Wake Up!";

  $(document).on('click','.close-text-box', function() {
    $('.text-box').hide();
  });

  showText(".text-box", wakeUp, 0, 100);

  var tl = new TimelineLite(),
    $coach = $('.coach-angry'),
    $bed = $('.bedroom-bed'),
    $wall = $('.bedroom-wall'),
    $furniture = $('.bedroom-furniture');

  tl.add( TweenMax.to($bed, 2, 
      {
        onUpdate: cssFilterTween, 
        onUpdateParams: ["{self}","blur", 40, 0]
      }
    ));

  tl.add( TweenMax.to($furniture, 2, 
      {
        onUpdate: cssFilterTween, 
        onUpdateParams: ["{self}","blur", 40, 0]
      }
    ));

  tl.add( TweenMax.to($coach, 2, 
      {
        onUpdate: cssFilterTween, 
        onUpdateParams: ["{self}","blur", 40, 0]
      }
    ));
});

