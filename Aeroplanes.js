class aeroplane{
  constructor(){
    this.radius = 28;
    this.leaving = random(-1,1)>0;
    
    
    if(this.leaving==true){
      this.position=createVector(r.position.x+this.radius+r.RW,r.position.y+this.radius);
      this.velocity = createVector(0,0);
      this.takeoff=false;
      this.INS=navigation[int(random(0,8))];
      //console.log(navigation[random(0,8)]);
      this.col = color(231,232,54);
    }else{
      this.position=createVector(random(height,height+200),random(width));
      this.velocity = p5.Vector.sub(r.position,this.position).normalize();
      this.takeoff=true;
      this.col = color(0,0,127);
    }
    //this.position = createVector(xpos,ypos);
    //this.velocity = createVector(0,0);
    
    this.path = new Path();
    this.hasPath = false;
    this.landing = false;
    //this.AC = ac;
    //this.ACC=color(0,0,0);
    //this.ACC=color(companies.get(ac));
    this.pv = createVector(0,0);

    
    
    
  }
  vecter(){
    this.pv=p5.Vector.sub(r.position,this.position);
    this.velocity.add(this.pv);
    this.velocity.normalize();
    //console.log(this.pv);
    this.takeoff=true;
  }
  update(){
    this.display();
    if(this.leaving){
      this.checkBorder();
    }
    this.path.update();
    this.path.display();
    //if(this.takeoff==false){
    //  this.vecter();
    //}
    if(this.hasPath){ 
      this.followPath();
    }else{
      this.autoFly();
    }
    this.checkOther();
  }
  parking(){
    Aeroplanes.splice(Aeroplanes.indexOf(this),1);
    score=score+1;
  }
  
  checkOther(){
    for(let other of Aeroplanes){
      if(this.position.x-this.radius<=other.position.x&&
      this.position.x+this.radius>=other.position.x&&
      this.position.y+this.radius>=other.position.y&&
      this.position.y-this.radius<=other.position.y&&this!=other&&this.takeoff==true&&other.takeoff==true){
        this.destroy();
        other.destroy();
      }
    }
  }
  checkBorder(){
    if(this.position.x+this.radius>=width||this.position.x-this.radius<=0||this.position.y-this.radius<=0||this.position.y+this.radius>=height)
    {
      //this.destroy();
      let airspace=AngleZero.angleBetween(p5.Vector.sub(this.position,createVector(width/2,height/2)));
      let direction;
      if(airspace>N&&airspace<=NE){
        direction="N";
      }else if(airspace>NE&&airspace<=E){
        direction="NE";
      }else if(airspace>E&&airspace<=SE){
        direction="E";
      }else if(airspace>SE&&airspace<=S){
        dirction="SE";
      }else if(airspace>S||airspace+360<=SW){
        direction="S";
      }else if(airspace+360>SW&&airspace+360<=W){
        direction="SW";
      }else if(airspace+360>W&&airspace+360<=W){
        direction="W";
      }else if(airspace+360>NW&&airspace+360<=N+360){
        direction="NW";
    }
    if(this.INS==direction){
      this.parking();
    }else{
      this.destroy();
    }
  }
  }
  
  
  destroy(){
    Aeroplanes.splice(Aeroplanes.indexOf(this),1);
    score=score-1;
  }
  
  autoFly(){
    this.position.add(this.velocity);
  }
  display(){
    fill(this.col);
    stroke(0);
    circle(this.position.x,this.position.y,this.radius);
    if(this.leaving==true){
      text(this.INS,this.position.x,this.position.y);
      //console.log(this.INS);
  }
  }
  checkMouse(){
    let mousePosition = createVector(mouseX, mouseY);
    if(p5.Vector.sub(mousePosition,this.position).mag()<this.radius){
      return true;
    }
    else{
      return false;
    }
  }
  createParticle() {
    let mousePosition = createVector(mouseX, mouseY);
    // New particle's velocity is based on mouse movement
    let velocity = p5.Vector.sub(mousePosition, previousParticlePosition);
    velocity.mult(0.00);
  
    // Add new particle
    if(this.takeoff){
      this.path.addParticle(mousePosition, velocity);
    }
    else{
      this.path.addParticle(previousParticlePosition, velocity);
    }
  
    // Schedule next particle
    nextParticleFrame = frameCount + framesBetweenParticles;
  
    // Store mouse values
    previousParticlePosition.set(mouseX, mouseY);
  }
  followPath(){
      let dist = p5.Vector.sub(this.path.particles[0].position,this.position);
      if(dist.mag()>2){
        this.velocity = dist.normalize();
        this.position.add(this.velocity);
      }
      else if(this.path.particles.length>1){
        this.path.particles.shift();
      }
      else{
        this.path.particles.shift();
        this.hasPath = false;
      }
      //console.log(this.path.particles[0].position);
  }
}
