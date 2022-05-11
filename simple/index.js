var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
c.width = 900;
c.height = 500;



var perm = [];
while (perm.length < 255) {
  while (perm.includes((val = Math.floor(Math.random() * 255))));
  perm.push(val);
}



var lerp = (a, b, t) => a + (b-a) * (1-Math.cos(t*Math.PI))/2;
var noise = x=> {
  x = x * 0.005 % 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
};

var player = new function() {
  this.x = c.width/2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0;
  this.rSpeed = 0;
  this.width = 100;
  this.height = 50;
  this.grounded = false;
  
  this.img = new Image();
  this.img.src = "car.png";

  this.draw = function() {
    var p1 = c.height - noise(t + this.x) * 0.25;
    var p2 = c.height - noise(t + 1 + this.x) * 0.25;

    var check = c.height - noise(t + this.x) * 0.25;
    if(Number.isNaN(check) || check < 0)
    {
      return;
    }
    
    this.grounded = false;
    
    if(p1 - this.height/2 > this.y) {
      this.ySpeed += 0.3;
    }else {
      this.ySpeed -= this.y - (p1 - this.height/2);
      this.y = p1 - this.height/2;
      this.grounded = true;
    }

    var failSensi = 0.6

    if(!playing || this.grounded && Math.abs(this.rot) > Math.PI * failSensi) {
      
        if(this.x <=0)
        {
            return;
        }
      
        playing = false;
        this.rSpeed = -0.5;
        k.ArrowUp = 1;
        this.x -= speed * 3;
        background = "grey";
    }
    
    var angle = Math.atan2((p2-this.height/2) - this.y, (this.x + this.height/4) - this.x);
    this.y += this.ySpeed;

    var colissionSensi = 0.6;

    if(this.grounded && playing) {
      this.rot -= (this.rot - angle) *colissionSensi;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }

    var rotAcceleration = 0.03;
    var rotSensitivity = 0.2;


    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * rotAcceleration;
    this.rot -= this.rSpeed * rotSensitivity;
    if(this.rot > Math.PI) this.rot = -Math.PI;
    if(this.rot < -Math.PI) this.rot = Math.PI;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    
    ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
    
    
  }
}

var t = 0;
var speed = 0;
var playing = true;
var k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};
var background = "#19f";


var endSpeedCounter = 10;
var score = 0;

function loop() {

  if(playing)
  {
    if(player.grounded)
    {
      speed -= (speed - (k.ArrowUp )) * 0.1;
      if(t<0){
        speed -= (speed - ( -k.ArrowDown)) * 0.1;
      }
      /*
      if(speed>0)
      {
        speed -= (speed + k.ArrowDown) * 0.2;
      }*/
    }
    //speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.03; // drive back
    t += 30 * speed;
    
    
  }

  if(!playing && t>0 && endSpeedCounter>0)
  {
    t += endSpeedCounter;
    endSpeedCounter = endSpeedCounter-0.01;
  }
  

  ctx.strokeStyle = background;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, c.width, c.height);

  // NaN bug
  var check = c.height - noise(t) * 0.25;
  if(!Number.isNaN(check) && check >= 0)
  {
    drawHills();
    player.draw();
  }

  

  // score
  if(playing)
  {
    score = Math.floor(t/100);
  }

  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.font = "bold 30px Courier ";
  ctx.fillText(score, c.width-10, 10); 

  if(!playing)
  {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 30px Courier ";
    ctx.fillText("Game over", c.width/2, c.height * (1/4)); 
    ctx.font = "15px Courier ";
    ctx.fillText("Press 'SPACE' to play again.", c.width/2, c.height * (2/4)); 
  }
  

  requestAnimationFrame(loop);
}

function drawHills()
{
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, c.height);
  for (let i = 0; i < c.width; i++) {
    ctx.lineTo(i, c.height - noise(t + i) * 0.25);
  }
  ctx.lineTo(c.width, c.height);
  ctx.fill();
}

onkeydown = d=> k[d.key] = 1;
onkeyup = d=> k[d.key] = 0;

requestAnimationFrame(loop);