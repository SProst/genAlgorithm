class Boid extends Eatable {
  constructor(x, y, genes, generation) {
    super(x, y, 100);
    if(genes) this.genes = genes;
    else this.genes = new Genes();
    if(generation) this.generation = generation;
    else this.generation = 1;
//    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.eaten = 0;
    this.dead = false;
    this.energy = random(100, 200);
  }
  update() {    
    this.vel.add(this.acc);
    this.vel.limit(this.genes.dna[1]);
    this.pos.add(this.vel);   
    this.acc.mult(0);
    this.checkWalls();
    this.calcEnergy();
    if(this.energy <= 0) {
      this.dead = true;
    }
  }
  mutate(factor) {
    this.genes.mutate(factor);
  }
  breed(other) {
    let newGene = new Genes((this.genes.dna[0] + other.genes.dna[0])/2,
      (this.genes.dna[1] + other.genes.dna[1])/2, 
      (this.genes.dna[2] + other.genes.dna[2])/2);
    let next = new Boid(this.pos.x, this.pos.y, newGene);
    next.mutate();    
    return next;
  }
  clone() {
    let newGenes = new Genes(this.genes);
    return new Boid(this.pos.x, this.pos.y, newGenes, this.generation++);
  }
  getFittness() {
    return this.eaten;
  }
  addForce(force) {
    force.limit(this.genes.dna[0]);
    this.acc.add(force);
  }
  calcEnergy() { 
    this.energy -= 0.05 * (this.genes.dna[3] * 2 + this.genes.dna[1] + this.genes.dna[0] * 0.5 + 0.01);
  }
  checkWalls() {
    if(this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
    } else if(this.pos.x > playArea.w){
      this.pos.x = playArea.w;
      this.vel.x *= -1;
    } else if(this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    } else if(this.pos.y > playArea.h) {
      this.pos.y = playArea.h;
      this.vel.y *= -1;
    }
  }
  avoid(targets) {
    let _this = this;
    let filtered = targets.filter(function(d) { 
      let distance = p5.Vector.dist(_this.pos, d.pos);
      return distance < _this.genes.dna[2] 
        && d.genes.dna[3] >= _this.genes.dna[3] * 1.95;      
    });
    let steering = createVector();
    for(let f of filtered) {
      steering.add(f.pos);
    }
    if(filtered.length > 0) {
      steering.div(filtered.length);
      steering = p5.Vector.sub(this.pos, steering);
      steering.setMag(this.genes.dna[1] * 5);
      steering.sub(this.vel);
      this.addForce(steering);
    }
  }
  seekFood(targets) {
    let _this = this;
    let filtered = targets.filter(function(d) {
      let distance = p5.Vector.dist(_this.pos, d.pos);
      if(distance < _this.genes.dna[2]) {
        if(d instanceof Boid) {
          return d !== _this && d.genes.dna[3]*2 < _this.genes.dna[3]; 
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
    return this.seek(filtered);
  }
  seek(targets) {
    if(targets.length <= 0) return null;
    let _this = this;
    targets = targets.sort(function(a,b) {
      return p5.Vector.dist(a.pos, _this.pos) - p5.Vector.dist(b.pos, _this.pos);
    });
    let desired = p5.Vector.sub(targets[0].pos, _this.pos);
    desired.setMag(this.genes.dna[1]);
    desired.sub(this.vel);
    return {
      target: targets[0],
      d: p5.Vector.dist(targets[0].pos, _this.pos),
      dir: desired
    };    
  }
  render() {
    push();
    stroke(255);
    fill(255,255,255,map(this.energy, 0, 200, 10, 200));
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + HALF_PI);
    let size = 2 * this.genes.dna[3];
    triangle(-size, size, 0, -size, size, size);
    stroke(255, 0, 0, 50);
    noFill();
    ellipse(0, 0, 2*this.genes.dna[2], 2*this.genes.dna[2]);
    pop();
  }
}
