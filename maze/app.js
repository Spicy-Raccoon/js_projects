//Create a simple maze game using Matter JS library
//documentation for Matter JS at: https://brm.io/matter-js/

//import some of the elements from Matter JS library
const { Engine, Render, Runner, World, Bodies } = Matter;

//boilerplate code to create a basic Matter canvas
//create an engine. with the engine you create a world object
const engine = Engine.create();
const {world} = engine;
//create a render object (shows content on screen)
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    //size of the canvas for out app
    width: 800,
    height: 600
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);
//to add shapes to the canvas
//(pos,pos,size,size, {options})
const shape = Bodies.rectangle(200,200,50,50, {
  isStatic: true
});
World.add(world, shape);
