// //Code to delay the fetch request on an input (Debouncing an input)
// let timeoutId;
// const onInput = (event) => {
//   //when the first letter of input is written, the setTimeout is run.
//   //On every letter after that, the if statement will run, and then setTimeout again
//   //after the input has not received anything for a second, the function will complete and fetch data
//   if (timeoutId) {
//     clearTimeout(timeoutId);
//   }
//   timeoutId = setTimeout(() => {
//     fetchData(event.target.value)
//   },1000)
// };

//code to debounce refactored and reusable
const debounce = (func, delay=1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay)
  };
};
