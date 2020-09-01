//Create variables here
var gameState;
var changeGameState,readGameState
var dog,happyDog,dogIMG;
var database;
var foods,foodStock;

var addFood,feedFood;
var fedTime,lastFed;
var foodObj;

var bedroomImg,gardenImg,washroomImg;
var saddogImg;


function preload()
{
  //load images here
  dogIMG=loadImage("Dog.png");
  happyDog=loadImage("happydog.png");

  bedroomImg=loadImage("Bed Room.png");
  gardenImg=loadImage("Garden.png");
  washroomImg=loadImage("Wash Room.png");
  saddogImg=loadImage("deadDog.png");
}

function setup() {
  createCanvas(900,500);

  addFood=createButton("ADD FOOD");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feedFood=createButton("FEED PET");
  feedFood.position(700,95);
  feedFood.mousePressed(feedFoods);

  database=firebase.database();

  dog=createSprite(250,250);
dog.addImage(dogIMG);
dog.scale=0.2;

  foodStock=database.ref('food');
  foodStock.on("value",readStock);

  foodObj=new Food();

  readGameState=database.ref('gameState');
  readGameState.on("value",function(data){
    gameState=data.val();
  })
}


function draw() {  
background(209,159,102);

foodObj.display();


if(gameState!=="Hungry"){
  feedFood.hide();
  addFood.hide();
 // dog.remove();
}else{
feedFood.show();
addFood.show();
//dog.addImage(saddogImg);
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}


//if(keyWentDown(UP_ARROW)){
  //writeStock(foods);
  //dog.addImage(happyDog);
//dog.scale=0.2;
//}

//if(keyWentDown(32)){
 // writeStock(foods);
  //dog.addImage(dogIMG);
  //dog.scale=0.2;
//}
text("Food:"+foods,210,150);
//text("Press UP_ARROW key to swap the image",170,50);
//text("Press space key to swap the image",170,70);

fedTime=database.ref('feedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
});


fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed :"+ lastFed%12 +"PM",350,30);
}else if(lastFed==0){
  text("Last Feed : 12 AM",350,30);
}else{
  text("Last Feed : "+ lastFed + "AM",350,30);
}

  drawSprites();
  //add styles here

}
  function readStock(data){
   foods=data.val();
   foodObj.updateFoodStock(foods);
  }

/*function writeStock(x){

  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
database.ref('/').update({
  FOOD:x
})
}*/

function addFoods(){
  foods++
  database.ref('/').update({
    food:foods
  })

}

function feedFoods(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  //foodObj.deductFood();
  //foods=foods-1;
  database.ref('/').update({
  food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}

