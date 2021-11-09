class Box {
  constructor(x, y, w, h, img = 0) {
    var options = {
      restitution: 1.2,
      density: 0.04
    };
    this.body = Bodies.rectangle(x, y, w, h, options);

    this.w = w;
    this.h = h;
    this.img = img;

    World.add(world, this.body);
  }

  overlap(x2, y2, w2, h2) {
    var x1 = this.body.position.x;
    var y1 = this.body.position.y;
    var w1 = this.w;
    var h1 = this.h;

    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
      return false;
    }

    return true;
  }

  display() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();
  }
  changeImage(img) {
    this.img = img;
  }

  displayWithImage() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}
