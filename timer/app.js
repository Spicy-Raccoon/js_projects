const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#pause');
const circle = document.querySelector('circle');

const perimeter = circle.getAttribute('r') * 2 * Math.PI;
circle.setAttribute('stroke-dasharray', perimeter);

let duration;
const timer = new Timer(durationInput, startButton, stopButton, {
  //the callbacks are not set in the Timer class, set them when creating the new Timer object
  onStart(totalDuration){
    duration=totalDuration;
  },
  onTick(timeRemaining) {
    //move the circle around the timer every tick event
    circle.setAttribute('stroke-dashoffset',
    perimeter * timeRemaining / duration - perimeter
   );
  },
  onComplete() {
    console.log('Timer completed')
  }
});
