const colorArray = ['red','orange','yellow','green','blue','purple']
const cells = document.querySelectorAll('.canvas-cell');
const chosenColor = document.querySelector('#chosen')
const options = document.querySelectorAll('.option')

let color;
for (let option of options) {
  option.addEventListener('click',()=>{
    color = option.classList[0];
    chosenColor.style.backgroundColor = option.classList[0];
})}

let isDrawing = false;
for (let cell of cells) {
  cell.addEventListener('mousedown', ()=>{
    cell.style.backgroundColor = color;
    isDrawing=true;
  });
  cell.addEventListener('mousemove', ()=>{
    if (isDrawing) {
      cell.style.backgroundColor = color;
    }
  });
  cell.addEventListener('mouseup', ()=>{
    isDrawing=false;
  })
}
document.addEventListener('mouseup', ()=>{
  isDrawing=false;
})

const clearTableBtn = document.querySelector('#clear-table')
clearTableBtn.addEventListener('click', ()=>{
  for (let cell of cells) {
    cell.style.backgroundColor = '';
  }
})

const fillTableBtn = document.querySelector('#fill-table')
fillTableBtn.addEventListener('click', ()=>{
  for (let cell of cells) {
    cell.style.backgroundColor = color;
  }
})
