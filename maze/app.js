//Create a simple maze game using Matter JS library
//documentation for Matter JS at: https://brm.io/matter-js/

//import some of the elements from Matter JS library
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

//used for the maze grid
const cellsHorizontal = 5;
const cellsVertical = 3;
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width/cellsHorizontal;
const unitLengthY = height/cellsVertical;
//boilerplate code to create a basic Matter canvas
//create an engine. with the engine you create a world object
const engine = Engine.create();
//disable gravity
engine.world.gravity.y = 0;
const {world} = engine;
//create a canvas object (shows content on screen)
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    //fill the shapes, instead of outlines
    wireframes: false,
    //size of the canvas for our app
    width: width,
    height: height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//to add shapes to the canvas
//(posx,posy,sizex,sizey, {options})
// const shape = Bodies.rectangle(200,200,50,50, {
//   // isStatic: true //by default gravity is on in Matter
// });
// World.add(world, shape);

/////////Create Walls in the canvas////////
const walls = [
  Bodies.rectangle(width/2,0,width,2,{isStatic:true}),
  Bodies.rectangle(width/2,height,width,2,{isStatic:true}),
  Bodies.rectangle(0,height/2,2,height,{isStatic:true}),
  Bodies.rectangle(width,height/2,2,height,{isStatic:true})
];
//can pass arrays in World.add()
World.add(world, walls)

//////Maze Generation///////
const shuffle = (arr) => {
  let counter = arr.length
  while (counter>0) {
    const index = Math.floor(Math.random()*counter);
    counter--;
    const temp = arr[counter];
    arr[counter]=arr[index];
    arr[index]=temp;
  }
  return arr
}

// with for loop for a 3x3 grid
// const grid = [];
// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);}}

///////concise way/////////
const grid = Array(cellsVertical).fill(null).map(()=>Array(cellsHorizontal).fill(false));
//vertical and horizontal lines of the grid
const verticals = Array(cellsVertical).fill(null).map(()=>Array(cellsHorizontal-1).fill(false));
const horizontals = Array(cellsVertical-1).fill(null).map(()=>Array(cellsHorizontal).fill(false));
//starting point of the maze
const startRow = Math.floor(Math.random()*cellsVertical);
const startColumn = Math.floor(Math.random()*cellsHorizontal);

//create the maze by moving through it from starting point
//Create Maze Algorithm:
const mazeAlgorithm = (row,column) => {
  //If cell at [row][column] previously visited, then return
  if (grid[row][column]) {
    return;
  }
  //Mark cell as visited, use grid array for marks
  grid[row][column]=true;
  //Assemble randomly-ordered list of neighbors
  const neighbours = shuffle([
    [row-1, column, 'up'],
    [row, column+1, 'right'],
    [row+1, column, 'down'],
    [row, column-1, 'left']
  ]);
  //for each neighbor...
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;
    //See if neighbour is out of bounds (out of grid)
    if (nextRow<0 || nextRow>=cellsVertical || nextColumn<0 || nextColumn>=cellsHorizontal) {
      continue;
    }
    //check if visited the neighbour, continue to next one
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    //remove wall from either horizontals or verticals
    if (direction==='left') {
      verticals[row][column-1] = true;
    } else if (direction==='right') {
      verticals[row][column] = true;
    } else if (direction==='up') {
      horizontals[row-1][column] = true;
    } else if (direction==='down') {
      horizontals[row][column] = true;
    }
    //visit next cell
    mazeAlgorithm(nextRow, nextColumn);
  }
};

mazeAlgorithm(startRow, startColumn)

///////DRAWING THE MAZE ON THE CANVAS///////
//Iterate over horizontals and verticals
//use rectangles from MatterJS to draw the shape
horizontals.forEach((row, rowIndex)=>{
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    //calculate the dimensions and position of the walls
    const wall=Bodies.rectangle(
      columnIndex*unitLengthX+unitLengthX/2,
      rowIndex*unitLengthY+unitLengthY,
      unitLengthX, 10,
      {isStatic:true,label:'wall',render: {fillStyle:'red'}});
      World.add(world,wall)
    })
});
verticals.forEach((row, rowIndex)=>{
  row.forEach((open, columnIndex)=>{
    if (open) {
      return;
    }
    const wall=Bodies.rectangle(
      unitLengthX*columnIndex+unitLengthX,
      unitLengthY*rowIndex+unitLengthY/2,
      10,
      unitLengthY,
      {isStatic:true, label:'wall',render:{fillStyle:'red'}});
    World.add(world, wall)
  });
});
///create the goal of the maze in the bottom right corner
const goal = Bodies.rectangle(
  width-unitLengthX/2,height-unitLengthY/2,
  unitLengthX*.5,unitLengthY*.5,
  {isStatic:true, label:'goal',render:{fillStyle:'green'}}
);
World.add(world, goal);
//Player ball
const ballRadius = Math.min(unitLengthX, unitLengthY)/4;
const ball = Bodies.circle(unitLengthX/2, unitLengthY/2, ballRadius,
  {label:'ball',render:{fillStyle:'blue'}});
World.add(world,ball);
//adding movement
document.addEventListener('keydown', event=>{
  const {x, y} = ball.velocity;
  if (event.keyCode===38) {
    Body.setVelocity(ball, {x,y:y-5})//move up
  }
  if (event.keyCode===39) {
    Body.setVelocity(ball, {x:x+5,y})//move right
  }
  if (event.keyCode===40) {
    Body.setVelocity(ball, {x,y:y+5})//move down
  }
  if (event.keyCode===37) {
    Body.setVelocity(ball, {x:x-5,y})//move left
  }
});

/////////WIN CONDITION///////////

Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(collision => {
    const labels = ['ball','goal'];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) { //win animation
        document.querySelector('.winner').classList.remove('hidden')
        world.gravity.y = 1;
        world.bodies.forEach(body => {
          //collapse all the walls
          if (body.label==='wall'){
            //set isStatic to false
            Body.setStatic(body, false)
    }})}
  })
})
