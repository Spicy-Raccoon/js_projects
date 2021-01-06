class Timer {
  // callbacks are optional, passed as an object with three properties. timer will work without it
  constructor(durationInput, startButton, pauseButton, callbacks) {
    this.durationInput = durationInput;
    this.startButton = startButton;
    this.pauseButton = pauseButton;
    if (callbacks) {
      this.onStart = callbacks.onStart;
      this.onTick = callbacks.onTick;
      this.onComplete = callbacks.onComplete;
    }
    //add click events to run start() and pause() functions
    this.startButton.addEventListener('click', this.start);
    this.pauseButton.addEventListener('click', this.pause);
  }
  //used arrow functions for 'this' to refer to the timer object
  start = () => {
    if (this.onStart) {
      this.onStart(this.timeRemaining);
    }
    this.tick();
    this.interval = setInterval(this.tick, 10);
  };
  pause = () => {
    clearInterval(this.interval);
  };
  tick = () => {
    if (this.timeRemaining<=0) {
      this.pause();
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      //set the difference in timeRemaining == to the setInterval milliseconds in start()
      this.timeRemaining = this.timeRemaining-0.01;
      if (this.onTick) {
        this.onTick(this.timeRemaining)
      }
    }
  };
  //get the time remaining to the duration input and set to the time passed, use as attributes later in the code
  get timeRemaining() {
    return parseFloat(this.durationInput.value);
  };
  set timeRemaining(time) {
    this.durationInput.value = time.toFixed(2);
  };
};
