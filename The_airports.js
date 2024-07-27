class airport{
  constructor(){
  }
}

class runway{
  constructor(xpos,ypos){
    this.position=createVector(xpos,ypos);
    this.RL=200;
    this.RW=30;
    this.occupied = false;
    
  }
  display(){
    fill('#808080');
    rect(this.position.x,this.position.y,this.RW,this.RL);
    
  }
  update(){
    this.display();
    for (let plane of Aeroplanes) {
      this.checkplane(plane);
    }
  }
  checkplane(p){
    
    if(!this.occupied&&p.landing==false){
     let hitStart = p.position.x+p.radius>=this.position.x&&p.position.x-p.radius<=this.position.x+this.RW&&p.position.y+p.radius>=this.position.y&&p.position.y-p.radius<=this.position.y;
     if(hitStart==true){
       this.occupied = true;
       p.landing = true;
    
       
       
     }
    }
    else{
      let hitEnd =  p.position.x+p.radius>=this.position.x&&p.position.x-p.radius<=this.position.x+this.RW&&p.position.y+p.radius>=this.position.y+this.RL&&p.position.y-p.radius<=this.position.y+this.RL;
       //console.log("hitEnd:"+hitEnd);
       if(hitEnd==true){
         this.occupied = false;
         if(p.landing&&p.leaving==false){
           p.parking();
           
         }
         else{
           p.takeoff = true;
         }
       }
       else{
         let landing = p.position.x+p.radius>=this.position.x&&p.position.x-p.radius<=this.position.x+this.RW&&p.position.y+p.radius>=this.position.y&&p.position.y-p.radius<=this.position.y+this.RL;
         //console.log(landing);
         if(!landing){
           this.occupied = false;
           p.landing = false;
         }
       
       }
    }
         
     
  }
}
