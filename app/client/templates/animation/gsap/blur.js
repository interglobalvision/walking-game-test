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


  var tl = new TimelineLite(),
    coach = $('.coach-angry');

  tl.add( TweenMax.to(coach, 2, 
      {
        onUpdate: cssFilterTween, 
        onUpdateParams: ["{self}","blur", 40, 0]
      }
    ));
  tl.to( coach, 2, {rotation: 360});
  //tl.play();
});

