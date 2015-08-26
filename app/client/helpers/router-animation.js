/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */


// Routes

Router.map(function() {

  // PIXI
  
  this.route('pixiAngry', {
    path: '/pixiAngry'
  });

  this.route('pixiBlur', {
    path: '/pixiBlur'
  });

  //GSAP

  this.route('gsapAngry', {
    path: '/gsapAngry'
  });

  this.route('gsapBlur', {
    path: '/gsapBlur'
  });


});
