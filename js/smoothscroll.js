$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 700, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});

const gravity = -0.718;
const drag = 0.97
const updateInterval = 22;
const ballRadius = 50;
const worldMaxX = window.innerWidth - 100;
const worldMaxY = window.innerHeight - 100;


// 1 big object to store the state of the game
var state = {
  touchIndicator: {
    x: 0,
    y: 0,
    opacity:0,
    view: document.querySelector('.touchIndicator')
  },
  balls: [{
    x: 0,
    y: 300,
    sx: 0,
    sy: 0,
    r: Math.random() * 360,
    sr:0,
    view: document.querySelectorAll('.ball')[0]
  }, {
    x: 100,
    y: 150,
    sx: 0,
    sy: 0,
    r: Math.random() * 360,
    sr:0,
    view: document.querySelectorAll('.ball')[1]
  }, {
    x: 200,
    y: 200,
    sx: 0,
    sy: 0,
    r: Math.random() * 360,
    sr:0,
    view: document.querySelectorAll('.ball')[2]
  }]
}

// start listening for clicks
document.querySelector('body').addEventListener('mousedown', onBodyMouseDown);
//document.querySelector('body').addEventListener('touchmove', onBodyMouseDown);
document.querySelector('html').addEventListener('touchstart', onBodyMouseDown);

function onBodyMouseDown(event) {

  event.preventDefault();

  if (event.pageX && event.pageY) {
      state.touchIndicator.x = event.pageX;
      state.touchIndicator.y = event.pageY;
    } else if (event.touches && event.touches.length > 0) {
      state.touchIndicator.x = event.touches[0].pageX;
      state.touchIndicator.y = event.touches[0].pageY;
    } else {
      console.log('confusing touches');
    }

    state.touchIndicator.opacity = 0.5;

    var tagName = event.target.tagName.toLowerCase();

  // handle clicks on potatos
  if (tagName == 'path'
      || tagName == 'svg') {

    state.touchIndicator.opacity = 1;

    // find world index for the clicked thing
    var searchElement = event.target;

    // look up the DOM to find the element with a worldindex attribute
    while(searchElement.getAttribute('worldindex') === null && searchElement.tagName.toLowerCase() !== 'html') {
      searchElement = searchElement.parentNode;
    }

    // use that index to associate the potato with some data in the game's state object
    var targetIndex = searchElement.getAttribute('worldindex');
    var ball = state.balls[parseInt(targetIndex)];

    console.log(targetIndex, ball, searchElement, event.target);

    // move the potato around
    ball.sx = ball.x + ballRadius - state.touchIndicator.x;
    ball.sy = ball.y + ballRadius * -2 - state.touchIndicator.y;

    ball.sr = Math.random() * 25;

    var maxSpeed = 25;

    clamp(ball, 'sx', maxSpeed);
    clamp(ball, 'sy', maxSpeed);

  }
}

function clamp(target, property, max) {

  if (target[property] > max) {
    target[property] = max;
  } else if (target[property] < -max) {
    target[property] = -max;
  }

}

// call every few MS to update state of game
function loop() {

  for (var index = 0; index < state.balls.length; index += 1) {

    var ballState = state.balls[index];

    // gravity
    ballState.sy -= gravity;

    // drag
    ballState.sx *= drag;
    ballState.sy *= drag;
    ballState.sr *= drag;

    // move things
    ballState.x += ballState.sx;
    ballState.y += ballState.sy;
    ballState.r += ballState.sr;

    // set boundaries for potatos
    if (ballState.x <= 0) {
      ballState.x = 0;
      ballState.sx *= -0.5;
    }

    if (ballState.x >= worldMaxX) {
      ballState.x = worldMaxX;
      ballState.sx *= -0.5;
    }

    if (ballState.y >= worldMaxY) {
      // some energy/bounce is lost in the repositioning step
      ballState.sy *= -0.5;
      ballState.y = worldMaxY;
    }

  }
}

// calls itself to render the game
function render() {

  // update each ball in the game
  for (var index = 0; index < state.balls.length; index += 1) {

    var ballState = state.balls[index];
    var element = ballState.view;

    // position balls
    element.style.transform = `translate3D(${ballState.x}px, ${ballState.y}px, 0) rotate3D(0,0,1,${ballState.r}deg)`;
    element.style['-webkit-transform'] = `translate3D(${ballState.x}px, ${ballState.y}px, 0) rotate3D(0,0,1,${ballState.r}deg)`;

    //element.style['-webkit-transform'] = `translate3D(${ballState.x}px, ${ballState.y}px, 0) rotate3D(0,0,1,${ballState.r}deg)`;
  }

  // position the DOM elements
  element = state.touchIndicator.view;
  element.style.transform = `translate3D(${state.touchIndicator.x + 5 }px, ${state.touchIndicator.y + 5}px, 0)`;
  element.style['-webkit-transform'] = `translate3D(${state.touchIndicator.x + 5 }px, ${state.touchIndicator.y + 5}px, 0)`;

  element.style.opacity = state.touchIndicator.opacity;

  // ask for the next frame
  window.requestAnimationFrame(render);

}

// start the game update loop
setInterval(loop, updateInterval);

// start the rendering loop
window.requestAnimationFrame(render);
