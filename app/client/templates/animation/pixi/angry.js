Template.pixiAngry.onRendered(function () {
  var renderer = PIXI.autoDetectRenderer(400, 400,{backgroundColor : 0xffffff});
  document.getElementById('stage').appendChild(renderer.view);

  // create the root of the scene graph
  var stage = new PIXI.Container();

  PIXI.loader
      .add('sprites/coach-angry.json')
      .load(onAssetsLoaded);

  var movie;

  function onAssetsLoaded() {

    // create an array of textures from an image path
    var frames = [];

    frames.push(PIXI.Texture.fromFrame('coach01.png'));
    frames.push(PIXI.Texture.fromFrame('coach02.png'));

    // create a MovieClip (brings back memories from the days of Flash, right ?)
    coach = new PIXI.extras.MovieClip(frames);

    /*
     * A MovieClip inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */

    coach.animationSpeed = 0.2;

    coach.play();

    stage.addChild(coach);

    requestAnimationFrame(animate);

    function animate() {

      // render the stage container
      renderer.render(stage);
      requestAnimationFrame(animate);

    }

  }

});

