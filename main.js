function main() {
    // module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Composite = Matter.Composite;

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.body,
    engine: engine
});
function resize() {
    render.bounds.max.x = window.innerWidth;
    render.bounds.max.y = window.innerHeight;
    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize()



// the roof is at 0, the floor is at 650
// the left side of the screen is x = 0
// the right side of the screen is x = 1000
console.log(render.bounds)
const m = (ft, inch) => (ft * 12 + inch) // convert feet, inches to inches

const inToPxFactor = render.canvas.height / (10 * 12); // multiply to convert inches to engine pixels

const s = inches => inToPxFactor * inches;
const widthBetweenTravAndLow = m(2, 0) + m(2, 0) + m(3, 6)
const scaleX = inX => s(inX) + (render.canvas.width - s(widthBetweenTravAndLow)) / 2; // fixed in global space
const scaleY = inY => s(m(10, 0)) -s(inY) // fixed in global space, the scale is ten feet
const scaledCircle = (inX, inY) =>  Bodies.circle(scaleX(inX), scaleY(inY), 5, { isStatic: true })

const travBar = scaledCircle(0,                           m(7, 7))
const highBar = scaledCircle(m(2, 0),                     m(6, 3.625));
const midBar =  scaledCircle(m(2, 0) + m(2, 0),           m(5, 0.25));
const lowBar =  scaledCircle(m(2, 0) + m(2, 0) + m(3, 6), m(4, 0.75));

const ground = Bodies.rectangle(render.canvas.width / 2, render.canvas.height - 30, render.canvas.width, 60, { isStatic: true });

const robotBase = Bodies.rectangle(scaleX(m(4, 0)), scaleY(10), s(30), s(6))

const hook1 = Bodies.rectangle(scaleX(m(4, 0)), scaleY(10) - s(5), s(2), s(10))
const hook2 = Bodies.rectangle(scaleX(m(4, 0)), scaleY(10) - s(10), s(10), s(2))
const hook3 = Bodies.rectangle(scaleX(m(4, 0)) + s(5.5), scaleY(10) - s(8.5), s(1), s(5))

const robot = Body.create({
    parts: [robotBase, hook1, hook2, hook3]
})

// // add all of the bodies to the world
Composite.add(engine.world, [ground, travBar, highBar, midBar, lowBar, robot]);


// run the renderer
Render.run(render);

// create runner
const runner = Runner.create();

// run the engine
Runner.run(runner, engine);
window.addEventListener("keydown",function(event){
    if(event.defaultPrevented) return;
    const k = event.key
    if(k === "a") {
        Matter.Body.applyForce(robot, robot.position, {
            x: -.3,
            y: -.3
        });
    }
    if(k === "u") {
        Matter.Body.applyForce(robot, robot.position, {
            x: .3,
            y: -.3
        });
    }
});
}
window.onload = main