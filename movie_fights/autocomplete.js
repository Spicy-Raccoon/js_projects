//Reusable code for other projects
const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
  //Instead of hardcoding the dropdown into HTML, we make a reusable element
  //classes are from Bulma framework
  //root is the div element where you want to create the autocomplete
  // const root = document.querySelector('.autocomplete') // refactored to be in the config of the function
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class='input'>
    <div class='dropdown'>
      <div class='dropdown-menu'>
        <div class='dropdown-content results'></div>
      </div>
    </div>
  `;
  //instead of looking for consts in the whole document, we just look at the root (div) provided
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');
  //fetchData is an async function. It will return a promise
  //to get the data instead, we have to make onInput an async function as well
  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    //close the dropdown if input is empty
    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    //reset the dropdown on every search
    resultsWrapper.innerHTML = '';
    // create the dropdown options
    dropdown.classList.add('is-active');
    for (let item of items) {
      //Bulma uses anchor to create options in a dropdown menu
      const option = document.createElement('a');
      //create item anchors in the dropdown
      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);
      //on click on an option, get item info
      option.addEventListener('click', ()=>{
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
      });
      //append all the options to the dropdown
      resultsWrapper.appendChild(option)
    }
  };
  //debounce function found in utils.js
  input.addEventListener('input', debounce(onInput,1000));
  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active')
    }
  })
};
