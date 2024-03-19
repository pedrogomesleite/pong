let rectDis = 10;

let leftX = rectDis;

let ball;

let leftRect;
let rightRect;

let borderH = 20;

let winL = 0;
let winR = 0;

let dificult;
let ballVel;

function setup() {
  createCanvas(600, 400);
    
  let dir = round(random(-1, 1));
  while(dir == 0) {
    dir = round(random(-1, 1));
  }
  dir *= 2;
  ball = new Circle(width / 2, height / 2, dir, 0);
  
  leftRect = new Rect(rectDis / 2, height / 2);
  rightRect = new Rect(width - rectDis, height / 2);

  dificult = createSlider(1, 5, 1, 1);
  ballVel = createSlider(1, 6, 2, 1);
}

function draw() {
  background(255);
  fill(0);
  rect(0, 0, width, borderH);
  rect(0, height - borderH, width, borderH);
  ball.create();
  leftRect.create();
  rightRect.create();
  ball.hitbox(leftRect, rightRect);

  if(keyIsDown(87) && leftRect.top >= borderH){
    leftRect.move(-3);
  }
  else if(keyIsDown(83) && leftRect.botton <= height - borderH){
    leftRect.move(3);
  }

  autoPlay(rightRect, ball);
  printWin();
}

function printWin() {
  textSize(40);
  text(winL, (width * 0.25) - 40, height * 0.4875);
  text(winR, width * 0.75, height * 0.4875);
}

let lastP = 0;

function autoPlay(rect, ball) {
  if(rect.top <= borderH) {
    rect.move(dificult.value());
    return;
  }
  else if(rect.botton > height - borderH) {
    rect.move((dificult.value()) * -1);
    return;
  }
  if(ball.y > rect.y) {
    rect.move(dificult.value());
  }
  else if(ball.y < rect.y) {
    rect.move((dificult.value()) * -1);
  }
  lastP = rect.y;
}

class Circle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.circleSize = 12;
    this.maxSpeed = 3;
  }
  
  create() {
    this.maxSpeed = ballVel.value();

    fill(0);
    circle(this.x, this.y, this.circleSize);
    
    let speed = sqrt(this.vx*this.vx + this.vy*this.vy);
    
    
    if(speed > this.maxSpeed){
      let s = this.maxSpeed / speed;
      this.vx *= s;
      this.vy *= s;
    }
    this.x += this.vx;
    this.y += this.vy;
  }
  
  hitbox(leftRct, rightRct) {
    let left = this.x - this.circleSize / 2;
    let right = this.x + this.circleSize / 2;
    let top = this.y - this.circleSize / 2;
    let botton = this.y + this.circleSize / 2;

    if(leftRct.hitbox(left, this.y, this.circleSize)) {
      this.vx = ballVel.value();
      this.vy = (this.y - leftRct.y) / 10;
    }
    else if(rightRct.hitbox(right - rightRct.w, this.y, -this.circleSize)){
      this.vx = -ballVel.value();
      this.vy = (this.y - rightRct.y) / 10;
    }

    if(left > width) {
      // left win
      winL += 1;
      this.y = height / 2;
      this.x = width / 2;
      let dir = round(random(-1, 1));
      while(dir == 0) {
        dir = round(random(-1, 1));
      }
      dir *= ballVel.value();
      this.vx = dir;
      this.vy = 0;
    }
    else if(right < 0) {
      // right win
      winR += 1;
      this.y = height / 2;
      this.x = width / 2;
      let dir = round(random(-1, 1));
      while(dir == 0) {
        dir = round(random(-1, 1));
      }
      dir *= ballVel.value();
      this.vx = dir;
      this.vy = 0;
    }
    
    if(top <= borderH){
      this.vy = this.vy * (-1);
    }
    else if(botton >= height - borderH) {
      this.vy = this.vy * (-1);
    }
  }
}

class Rect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.h = 50;
    this.w = 5;
    this.med = y + this.h / 2;
    this.top = this.y - this.h / 2;
    this.botton = this.y + this.h / 2;
  }
  
  create() {
    fill(0);
    rect(this.x, this.y - this.h / 2, this.w, this.h);
  }
  
  hitbox(x, y, w) {
    if(y >= this.top && y <= this.botton && ((x >= this.x && x <= this.x + this.w) || (x + w >= this.x && x + w <= this.x + this.w))){
      return true;
    }
    else {
      return false;
    }
  }

  move(y) {
    this.y += y;
    this.top = this.y - this.h / 2;
    this.botton = this.y + this.h / 2;
  }
}