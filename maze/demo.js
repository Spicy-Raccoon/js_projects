//Create a simple maze game using Matter JS library
//documentation for Matter JS at: https://brm.io/matter-js/

//import some of the elements from Matter JS library
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

const width = 800;
const height = 600;
//boilerplate code to create a basic Matter canvas
//create an engine. with the engine you create a world object
const engine = Engine.create();
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

//add Mouse click and drag capability
World.add(world, MouseConstraint.create(engine, {
  mouse: Mouse.create(render.canvas)
}));

//to add shapes to the canvas
//(pos,pos,size,size, {options})
// const shape = Bodies.rectangle(200,200,50,50, {
//   // isStatic: true //by default gravity is on in Matter
// });
// World.add(world, shape);

//Create Walls in the canvas
const walls = [
  Bodies.rectangle(400,0,800,40,{isStatic:true}),
  Bodies.rectangle(400,600,800,40,{isStatic:true}),
  Bodies.rectangle(0,300,40,600,{isStatic:true}),
  Bodies.rectangle(800,300,40,600,{isStatic:true})
];
//can pass arrays in World.add
World.add(world, walls)

//Random Shapes generator

for (var i = 0; i < 50; i++) {
  if (Math.random() > 0.5) {
    World.add(world, Bodies.rectangle(Math.random()*width, Math.random()*height, 50, 50));
  } else {
    World.add(world, Bodies.circle(Math.random()*width, Math.random()*height, 30, {
      render: {
        fillStyle: 'red'
      }
    }));
  }
}
