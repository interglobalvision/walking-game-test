Template.gsapAngry.onRendered(function () {
  var tl = new TimelineLite(),
    coach = $('.coach-angry');

  tl.to(coach, 5, {rotation:360});
});

