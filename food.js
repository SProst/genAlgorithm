class Food extends Eatable {
  constructor(x, y, cal) {
    super(x, y, cal || 50);
    this.vel = createVector();
    this.targeted = false;
  }
  render() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(color('green'));
    strokeWeight(2);
    fill(color('green'));
    point(0,0);
    pop();    
  }
}
