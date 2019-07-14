const randRange = [[0,5],[1,5],[100,200],[1,5]];
const mutateRange = [-0.2,0.2];
class Genes {
  constructor(ma, ms, per, mass) {
    this.dna = [];
    if(ma instanceof Genes) {
      for(let i = 0; i < 4; i++) {
        this.dna[i] = ma.dna[i];
      }
    } else {
      this.dna[0] = ma || random(...randRange[0]);
      this.dna[1] = ms || random(...randRange[1]);
      this.dna[2] = per || random(...randRange[2]);
      this.dna[3] = mass || random(...randRange[3]);
      this.dna[1] *= (1/this.dna[3]);      
    }
  }
  mutate(factor) {
    for(let i = 0; i < this.dna.length; i++) {
      if(random() < factor) {
        this.dna[i] += this.dna[i] * random(...mutateRange);
        if(this.dna[i] < 0) {
          this.dna[i] = 0.001;
        }
      }
    }
    
  }
}
