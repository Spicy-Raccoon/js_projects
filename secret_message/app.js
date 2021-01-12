//////CREATE THE MESSAGE////////
document.querySelector('form').addEventListener('submit', event => {
  // stop default browser behaviour of submitting the form
  event.preventDefault();
  //hide the message form and show the link form on submit
  document.querySelector('#message-form').classList.add('hide');
  document.querySelector('#link-form').classList.remove('hide');
  //encode the message with Base64 encoding
  //built in JS method btoa() for encoding
  const input = document.querySelector('#message-input');
  const encrypted = btoa(input.value);
  //window.location prints an object with the current url
  //to get just the url string print window.location as a string
  const linkInput = document.querySelector('#link-input')
  //window.location prints an object with the current url
  //to get just the url string print window.location as a string
  linkInput.value = `${window.location}#${encrypted}`;
  //automatically select the link after pressing submit
  linkInput.select();
});

/////RETRIEVE THE MESSAGE////////
const {hash} = window.location;
const message = atob(hash.replace('#',''));
if (message) {
  document.querySelector('#message-form').classList.add('hide');
  document.querySelector('#message-show').classList.remove('hide');
  document.querySelector('h1').innerHTML = message;
};
