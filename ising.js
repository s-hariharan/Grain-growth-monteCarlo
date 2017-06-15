var canvas = document.getElementById('theCanvas');
var context = canvas.getContext('2d');
var image = context.createImageData(canvas.width, canvas.height);
var tempSlider = document.getElementById('tempSlider');


var states = 1000;
var size = 500;
var stepsPerFrame = 10000;
var startTime = 0;
var squareWidth = canvas.width/size;
var accept = 0;
var running = false;
var lattice = false; //false is for square
//initialization

var col = new Array(states);
for( var i=0;i<states;i++){
  col[i] = new Array(3);
  for(var j=0; j<3;j++){
    col[i][j] = Math.floor(Math.random()*255);
    col[i][j] = Math.floor(Math.random()*255);
    col[i][j] = Math.floor(Math.random()*255);
  }
}


var s = new Array(size);
for(var i=0;i<size;i++){
  s[i] = new Array(size);
  for( var j=0; j< size; j++){
    s[i][j] = Math.floor(Math.random()*states);
    colorSquare(i,j);
  }
}
context.putImageData(image,0,0);
simulate();

function simulate(){
  if(running){
  var T = Number(tempSlider.value);
  for( var step=0; step<stepsPerFrame; step++){
    var i = Math.floor(Math.random()*size);
    var j = Math.floor(Math.random()*size);
    if(lattice){
      var ediff = deltaU(i,j);
    }
    else{
      var ediff = deltaUt(i,j);
    }
    if ((ediff[0] <= 0) || (Math.random() < Math.exp(-ediff[0]/T))){
      s[i][j]=ediff[1];
      colorSquare(i,j);

    }
  }
  context.putImageData(image,0,0);
}
  window.setTimeout(simulate,1);

}

function colorSquare(i,j) {
  var r,g,b;
  var val=s[i][j];
  r=col[val][0];
  g=col[val][1];
  b=col[val][2];
  for(py=j*squareWidth; py<(j+1)*squareWidth; py++) {
    for( px= i*squareWidth; px<(i+1)*squareWidth; px++){
      var index = (px +py*image.width)*4;
      image.data[index+0] = r;
      image.data[index+1] = g;
      image.data[index+2] = b;
      image.data[index+3] = 255;
    }
  }
}

function deltaU(i,j){
  var leftS, rightS, topS, bottomS;
  if (i == 0) leftS = s[size-1][j]; else leftS = s[i-1][j];
  if (i == size-1) rightS = s[0][j]; else rightS = s[i+1][j];
  if (j == 0) topS = s[i][size-1]; else topS = s[i][j-1];
  if (j == size-1) bottomS = s[i][0]; else bottomS = s[i][j+1];
  var neighbour = [bottomS,topS,rightS,leftS];
  var ranval = Math.floor(Math.random()*4);
  temp = s[i][j];
  sigma1=0;
  sigma2=0;
  for(var k=0; k<4; k++){
    if(s[i][j]!=neighbour[k]){sigma1+=1;}
    if(neighbour[ranval]!=neighbour[k]){sigma2+=1;}
  }
  var ediff=sigma2-sigma1;
  var re = [ediff,neighbour[ranval]];
  return re;
}

function deltaUt(i,j) {
  var b,t,r,l;
  b=j-1;
  t=j+1;
  r=i+1;
  l=i-1;

  if(i==0)
    l=size-1;
  if(i==size-1)
    r=0;
  if(j==0)
    b=size-1;
  if(j==size-1)
    t=0;
    
    var hexaneigh = [s[r][j],s[l][j],s[l][b],s[r][t],s[r][b],s[l][t]];
    var ranval = Math.floor(Math.random()*6);
    temp = s[i][j];
    sigma1=0;
    sigma2=0;
    for(var k=0; k<6; k++){
      if(s[i][j]!=hexaneigh[k]){sigma1+=1;}
      if(hexaneigh[ranval]!=hexaneigh[k]){sigma2+=1;}
    }
    var ediff=sigma2-sigma1;
    var re = [ediff,hexaneigh[ranval]];
    return re;
}




function showTemp(){
  tempReadout.value = Number(tempSlider.value).toFixed(2);
}

function startStop() {
  running = !running;
  if(running){
  startButton.value = " Pause ";
}
else {
  startButton.value = " Resume ";
}
}

function latticeSwitch() {
  lattice = !lattice;
  if(lattice){
  Lattice.value = " Triangular ";
}
else {
  Lattice.value = " square ";
}
}
