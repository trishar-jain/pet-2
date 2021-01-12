var dog,dogImg,happyDog;
var database;
var foodS,foodStock,foodObj;
var feed,addFood;
var fedTime,lastFed;
function preload(){
   dogImg=loadImage("images/dogImg.png");
   happyDog=loadImage("images/dogImg1.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(700,500);

  foodObj = new Food();

  dog=createSprite(600,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed=createButton("Feed The Dog");
  feed.position(750,200);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(860,200);
  addFood.mousePressed(addFoods);

}

// function to display UI
function draw() {
  background("cyan");
 
  foodObj.display();

  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  if (lastFed>=12){
    text("Last Feed :"+lastFed%12 + "PM",350,30);
  }
  else if (lastFed===0){
    text("Last Feed : 12 AM",350,30);
  }
  else{
    text("Last Feed:"+lastFed +"AM",350,30);
  }
  
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,50);
  textSize(13);
  
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
    
  
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}
function feedDog(){
dog.addImage(happyDog);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
Food:foodObj.getFoodStock(),
FeedTime:hour()
})
}
function addFoods(){
foodS++;
database.ref('/').update({
Food:foodS
})
}