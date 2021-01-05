class Timer {
  constructor(durationInput, startButton, stopButton) {
    this.durationInput = durationInput;
    this.startButton = startButton;
    this.stopButton = stopButton;
    this.startButton.addEventListener('click', this.start);
  }
  start() {
    console.log('timer started')
  }
}

const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#pause');

const timer = new Timer(durationInput, startButton, stopButton);
