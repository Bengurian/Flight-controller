let op;
let Aeroplanes = [];
let drawPath = false;
let companies;
let r;
let d;
let score=0;
let click= false;
let navigation = ["N","NE","E","SE","S","SW","W","NW"];
let AngleZero;
let N,NE,E,SE,S,SW,W,NW;
// How long until the next particle
let framesBetweenParticles = 5;
let nextParticleFrame = 0;
// Location of last created particle
let previousParticlePosition;
// How long it takes for a particle to fade out
let particleFadeFrames = 3;
function setup() {
  createCanvas(720,720);
  colorMode(RGB);
  
  r=new runway(0.5*width,0.5*height);
  d=new destination();
  
  //let myDictionary = createStringDict('p5', 'js');
  //myDictionary.create('happy', 'coding');
  //console.log(myDictionary);
  
  companies = createStringDict('A', 'rgb(220,20,60)');
  companies.create('B', 'rgb(255,69,0)');
  companies.create('C', 'rgb(65,105,225)');
  companies.create('D', 'rgb(173,216,230)');
  companies.create('E', 'rgb(107,142,35)');
  companies.create('S', 'rgb(255,250,250)');
  //console.log(companies);
  // Start with a default vector and then use this to save the position
  // of the last created particle
  previousParticlePosition = createVector();
  
  Aeroplanes.push(new aeroplane());
  Aeroplanes.push(new aeroplane());
  Aeroplanes.push(new aeroplane());
  Aeroplanes.push(new aeroplane());
  Aeroplanes.push(new aeroplane());
  Aeroplanes.push(new aeroplane());
  
  AngleZero=createVector(0,-1);
  N=AngleZero.angleBetween(p5.Vector.sub(createVector(width/3,0),createVector(width/2,height/2)));
  NE=AngleZero.angleBetween(p5.Vector.sub(createVector(2*width/3),createVector(width/2,height/2)));
  E=AngleZero.angleBetween(p5.Vector.sub(createVector(width,height/3),createVector(width/2,height/2)));
  SE=AngleZero.angleBetween(p5.Vector.sub(createVector(width,2*height/3),createVector(width/2,height/2)));
  s=AngleZero.angleBetween(p5.Vector.sub(createVector(2*width/3,height),createVector(width/2,height/2)));
  SW=AngleZero.angleBetween(p5.Vector.sub(createVector(width/3,height),createVector(width/2,height/2)))+360;
  W=AngleZero.angleBetween(p5.Vector.sub(createVector(0,2*height/3),createVector(width/2,height/2)))+360;
  NW=AngleZero.angleBetween(p5.Vector.sub(createVector(0,height/3),createVector(width/2,height/2)))+360;
}

function draw() {
  background(200);
  
  text('Canton for SE',750,20,255);
  text('Peking for NE',750,40,255);
  textWidth(200)
  textLeading(10);
  r.update();
  d.update();
  //text(lines, 70, 25);
  describe('The text "Canton for SE" written in white in the right of a gray square.');
  for (let Aeroplane of Aeroplanes) {
      Aeroplane.update();
    }
  text('Your score is '+score,0,10,255);
  if(Aeroplanes.length<5){
    Aeroplanes.push(new aeroplane());
  }
}
// Create a new path when mouse is pressed
function mousePressed() {
  
  //console.log(p.checkMouse());
  for (let Aeroplane of Aeroplanes) {
    if(Aeroplane.checkMouse()&&click==false){
      op = Aeroplane;
      click=true;
      op.path = new Path();
      if(op.takeoff){
        nextParticleFrame = frameCount;
        drawPath = true;
        
        
        previousParticlePosition.set(mouseX, mouseY);
        op.createParticle(); 
        op.hasPath = true;
      }
      else{
        op.position.set(r.position.x+r.RW/2,r.position.y);
        previousParticlePosition.set(r.position.x+r.RW/2,r.position.y+r.RL);
        op.createParticle(); 
        op.hasPath = true;
      }
    }
  }
}
// Add particles when mouse is dragged
function mouseDragged() {
  // If it's time for a new point
  if (frameCount >= nextParticleFrame&&drawPath) {
    op.createParticle();
  }
}

function mouseReleased(){
  if(drawPath){
    drawPath=false;
    op.hasPath = true;
    //console.log(op.path);
  }
  click = false;
}

// Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
    this.rgb = color(70,130,180,93);
    this.pathColor = color('#FFFF00');
  }

  addParticle(position, velocity) {
    // Add a new particle with a position, velocity, and hue
    let particleHue = (this.particles.length * 30) % 360;
    this.particles.push(new Particle(position, velocity,this.rgb));
  }

  // Update all particles
  update() {
    for (let particle of this.particles) {
      particle.update();
    }
  }
  // Draw a line between two particles
  connectParticles(particleA, particleB) {
    let opacity = particleA.framesRemaining / particleFadeFrames;
    stroke(this.pathColor, opacity);
    line(
      particleA.position.x,
      particleA.position.y,
      particleB.position.x,
      particleB.position.y
    );
  }
  // Display path
  display() {
    // Loop through backwards so that when a particle is removed,
    // the index number for the next loop will match up with the
    // particle before the removed one
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      // Remove this particle if it has no frames remaining
      
        this.particles[i].display();

        // If there is a particle after this one
        if (i < this.particles.length - 1) {
          // Connect them with a line
          this.connectParticles(this.particles[i], this.particles[i + 1]);
        }
      
    }
  }
}

// Particle along a path
class Particle {
  constructor(position, velocity, rgb) {
    this.position = position.copy();
    this.velocity = velocity.copy();
    this.rgb = rgb;
    this.drag = 0.5;
    this.framesRemaining = particleFadeFrames;
  }

  update() {
    // Move it
    this.position.add(this.velocity);

    // Slow it down
    this.velocity.mult(this.drag);

    // Fade it out
    this.framesRemaining = this.framesRemaining - 1;
  }

  // Draw particle
  display() {
    
    noStroke();
    fill(this.rgb);
    circle(this.position.x, this.position.y, 17);
  }
}
