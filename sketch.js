//Create variables here
var database;

var dog;
var dogImage, happyDogImage;

var foodS, foodStock;

var feed, add;

var fedTime;

var foodObject;

function preload()
{
  dogImage = loadImage("images/dogImg.png")
  happyDogImage = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(800, 550);

  database = firebase.database();
  
  dog = createSprite(600, 325, 20, 20);
  dog.addImage(dogImage);
  dog.scale = 0.25;

  foodStock = database.ref("food");
  foodStock.on("value", readStock);

  fedTime = database.ref("fedTime");
  fedTime.on("value", function(data){
    fedTime = data.val();
  });
  
  foodObject = new Food();

  feed = createButton("Feed the Dog");
  feed.position(800, 175);
  feed.mousePressed(feedDog);

  add = createButton("Add Food");
  add.position(900, 175);
  add.mousePressed(addFood);
}


function draw() {  
  background(46, 139, 87);

  foodObject.display();

  textSize(24);
  fill("snow");
  text("Press the Button to Feed the Dog!",  30, 90);

  textSize(20);
  text("Food Left: " + foodS, 30, 40);

  if(fedTime >= 12) {
    text("Last Fed: " + fedTime%12 + " PM", 350, 30);
  }
  else if(fedTime == 0) {
    text("Last Fed: 12 AM", 350, 30);
  }
  else{
    text("Last Fed: " + fedTime + " AM", 350, 30);
  }

  drawSprites();
}


function readStock(data) {
  foodS = data.val();
  foodObject.updateFoodStock(foodS);
}


function feedDog() {
  dog.addImage(happyDogImage);

  foodS--;
  database.ref('/').update ({
    food: foodS,
    fedTime: hour()
  })
}


function addFood() {
  dog.addImage(dogImage);

  foodS++;
  database.ref('/').update({
    food: foodS
  });
}