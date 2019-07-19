let boid = [];
let food = [];
let matingPool = [];
let generation = 0;
let speed = 1;
const creatureCount = 50;
const playArea = {w:600, h:600};
function setup() {
  createCanvas(800,600);
  for(let i = 0; i < creatureCount; i++)
    boid.push(new Boid(random(playArea.w), random(playArea.h)));
  for(let i = 0; i < 10;i++)
    food.push(new Food(random(playArea.w), random(playArea.h)));
  let slider = createSlider(1, 200, 1, 1);
  slider.input(function() {
    speed = this.value();
  })
}

function mousePressed() {
 
}
function findSelection(boids) {
  let maxFit = -Infinity;
  for(let b of boids) {
    if(b.getFittness() > maxFit) {
      maxFit = b.getFittness();
    }
  }
  matingPool = [];
  for(let b of boids) {
    let n = b.getFittness() / maxFit * 400;
    for(let i = 0; i < n; i++) {
      matingPool.push(b);
    }
  }
}
function repopulate() {
  findSelection(boid);
  boid = [];
  for(let i = 0; i < creatureCount; i++) {
    let parent = random(matingPool);
    let other = random(matingPool);
    boid.push(parent.breed(other));
  }
  generation++;
}
function drawStats(arr, title, x, y) {
  let sum = 0, maximum = -Infinity, minimum = Infinity;
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] < minimum) 
      minimum = arr[i];
    if(arr[i] > maximum)
      maximum = arr[i];
    sum += arr[i];
  }
  text(title, x + 5, y + 15);
  text('min: ' + minimum.toFixed(3), x + 5, y + 35);
  text('ave: ' + (sum/arr.length).toFixed(3), x + 5, y + 55);
  text('max: ' + maximum.toFixed(3), x + 5, y + 75);
}
function processClosest(closest, b, arr) {
  if(closest) {
    b.addForce(closest.dir);
    if(closest.d < 5) {
      b.eaten++;
      b.energy += closest.target.cal;
      arr.splice(arr.indexOf(closest.target), 1);
    }
  }
}
function draw() {
  background(0);
  for(let i = 0; i < speed; i++) {
    for(let b of boid) {
      b.update();
      let closestFood = b.seekFood(food);
      let closestBoid = b.seekFood(boid);
      if(closestFood && closestBoid) {
        if(closestFood.d < closestBoid.d) {
          b.addForce(closestFood.dir);
          if(closestFood.d < 5) {
            b.eaten++;
            b.energy += closestFood.target.cal;
            food.splice(food.indexOf(closestFood.target), 1);
          }
        } else {
          b.addForce(closestBoid.dir);
          if(closestBoid.d < 5) {
            b.eaten++;
            b.energy += closestBoid.target.cal;
            boid.splice(boid.indexOf(closestBoid.target), 1);
          }
        }      
      } else if(closestFood) {
        b.addForce(closestFood.dir);
        if(closestFood.d < 5) {
          b.eaten++;
          b.energy += closestFood.target.cal;
          food.splice(food.indexOf(closestFood.target), 1);
        }
      } else if(closestBoid) {
        b.addForce(closestBoid.dir);
        if(closestBoid.d < 5) {
          b.eaten++;
          b.energy += closestBoid.target.cal;
          boid.splice(boid.indexOf(closestBoid.target), 1);
        }
      } else {
        //b.vel.mult(0.99);
      }
      b.avoid(boid);

      
      if(b.energy >= 300) {
        let c = b.clone();
        b.energy -= 100;
        c.mutate(0.08);
        boid.push(c);
      }
      if(b.dead) {
        food.push(new Food(b.pos.x, b.pos.y, b.cal));
        boid.splice(boid.indexOf(b), 1);
      }
    }
    if(random() < 0.3)
      food.push(new Food(random(playArea.w), random(playArea.h)));
  }
  for(let b of boid) {
    b.render();
  }
  for(let f of food) {
    f.render();
  }
 
  //if(frameCount % 1000 == 0) {
  //  repopulate();
  //}
  stroke(255);
  noFill();
  //text('Generation ' + generation, 5,15);
  let accArr = boid.map(function(d) { return d.genes.dna[0];});
  drawStats(accArr, 'acceleration' , 600, 0);
  let speedArr = boid.map(function(d) { return d.genes.dna[1];});
  drawStats(speedArr, 'speed', 600, 100);
  let perceptionArr = boid.map(function(d) { return d.genes.dna[2];});
  drawStats(perceptionArr, 'perception', 600, 200);
  let energyArr = boid.map(function(d) { return d.energy;});
  drawStats(energyArr, 'energy', 600, 300);
  let genArr = boid.map(function(d) { return d.generation;});
  drawStats(genArr, 'generation', 600, 400);
  let massArr = boid.map(function(d) { return d.genes.dna[3];});
  drawStats(massArr, 'Mass', 700, 0);
  text('total: ' + boid.length, 605, 515);
}
