//Authentic or Not by Yiting Liu and Shannel Doshi © 2019
//Official web: https://authenticorbust.wixsite.com/authenticornot

//instruction
//when button is pressed once, game on, use encoder to choose indian/chinese cuisine
//press button to confirm
//use encoder to select ingredients layers
//press to end the game 
//gameover - percentage 
//wait for 2 seconds, display detailed ingredients and prompt to scan qrcode


let bowls = [];
let userIngredientsChinese = [];
let userIngredientsIndian = [];
let IndianRightIngredients = ['White Rice', 'Egg', 'Chicken', 'Salt', 'Turmeric', 'Fried Onions', 'Cloves'];
let ChineseRightIngredients = ['Pork Belly', 'Front Pork Leg', 'Salt',
  'Soysauce', 'Fermented Soybeans', 'Garlic', 'Green Onions', 'Green Pepper'
];

let IndianProteins = [];
let IndianGrains = [];
let IndianSpices = [];
let ChineseProteins = [];
let ChineseVeges = [];
let ChineseSpices = [];
let Indianlayer = "grainLayer";
let Chineselayer = "proteinLayer"; //should convert them into " " - else function to select more layers - have default layers showing up as well 
let radforSmall = 252;
let radforBig = 846;
let bigBowl;
let bowlNum; //takes reading from the sensors 
let layerName = "instructions";
let IndianLayerNum = 1;
let ChineseLayerNum = 1;
let timer = 60; //60 seconds as the timer 
let delayTimer = 2;

let indianLayerResult = false;
let chineseLayerResult = false;
let colorCounter = 0;
let arrow;
let colorFill;
let UISelected = [];
let uniqueUISelected;
let rightresult = '';
let wrongresult = '';
let score = 0; //the score 

let gasstoveSound;
let Chinesemusic;
let Indianmusic;
let saltgrindingSound;
let sizzlingmeatSound;
let stirringSound;
let choppingvegeSound;
let droppingriceSound;
let drumrollSound;
let winningSound;
let losingSound;

let chineseDish;
let indianDish;

// let resetCounter = 0;

let lead = 865 / 15; //height/15

let bowlOne = {
  x: 180,
  y: 288
}
let bowlTwo = {

  x: 180,
  y: 576
}

let bowlThree = {
  x: 1404,
  y: 288

}
let bowlFour = {
  x: 1404,
  y: 576
}

// var isPlayingMusic = false;

var serial; // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem14201'; // fill in your serial port name here
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas

function serverConnected() {
  print("Connected to Server");
}

function gotOpen() {
  print("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  let currentString = serial.readLine(); // read the incoming string
  trim(currentString); // remove any trailing whitespace
  if (!currentString) return; // if the string is empty, do no more
  console.log(currentString); // print the string
  latestData = currentString; // save it for the draw method

  if (latestData == "instructions") {
    layerName = "instructions";
  }
  if (latestData == "GameOn") {
    layerName = "GameOn";
  }

  if (latestData == "GameOver") {
    layerName = "GameOver";
  }

  if (latestData == "IndianCuisineSelected") {
    layerName = "IndianCuisineSelected";

  }
  if (latestData == "ChineseCuisineSelected") {
    layerName = "ChineseCuisineSelected";

  }
  if (latestData == "IndianLayerSelected") {
    layerName = "Indian";
    // console.log('IndianLayerSelected');
  }

  if (latestData == "IndianL1") {
    IndianLayerNum = 1;
  }
  if (latestData == "IndianL2") {
    IndianLayerNum = 2;
  }
  if (latestData == "IndianL3") {
    IndianLayerNum = 3;
  }


  if (latestData == "ChineseLayerSelected") {
    //show the chinese dish - green pork and pepper 
    layerName = "Chinese";

    //do the chinese layers 
    // console.log('ChineseLayerSelected');
  }

  if (latestData == "ChineseL1") {
    ChineseLayerNum = 1;
  }
  if (latestData == "ChineseL2") {
    ChineseLayerNum = 2;
  }
  if (latestData == "ChineseL3") {
    ChineseLayerNum = 3;
  }

}

//select the bowls from the reading of Ultrasonic sensors
function datafromUltrasonicSensor(latestData) {
  if (layerName == "Indian") {
    if (latestData[0] == 'S') {
      bowlNum = int(latestData[1]);
      bowls[bowlNum - 1].clicked(userIngredientsIndian);
      console.log(bowlNum);
    }
  }
  if (layerName == "Chinese") {
    if (latestData[0] == 'S') {
      bowlNum = int(latestData[1]);
      bowls[bowlNum - 1].clicked(userIngredientsChinese);
      console.log(bowlNum);
    }
  }
}

// We got raw from the serial port
function gotRawData(thedata) {
  console.log("gotRawData" + thedata);
}

function preload() {

  myFont = loadFont('../assets/ComingSoon-Regular.ttf');
  titleFont = loadFont('../assets/BunnyCookies.ttf');

  arrow = loadImage('../assets/elements/loadingarrow.png');

  Chinesemusic = loadSound('../assets/sounds/Chinesemusic.mp3');
  Indianmusic = loadSound('../assets/sounds/Indianmusic.mp3');

  gasstoveSound = loadSound('../assets/sounds/gasstove.mp3');
  saltgrindingSound = loadSound('../assets/sounds/saltgrinding.mp3');
  sizzlingmeatSound = loadSound('../assets/sounds/sizzlingmeat.wav');
  stirringSound = loadSound('../assets/sounds/stirring.mp3');
  choppingvegeSound = loadSound('../assets/sounds/choppingveges.wav');
  droppingriceSound = loadSound('../assets/sounds/droppingrice.mp3');

  drumrollSound = loadSound('../assets/sounds/drumroll.mp3');
  winningSound = loadSound('../assets/sounds/winning.mp3');
  losingSound = loadSound('../assets/sounds/losing.mp3');


  chineseDish = loadImage('../assets/finalcuisines/chinese.png');
  indianDish = loadImage('../assets/finalcuisines/indian.png');

  IndianProteins = [{
      name: 'Chicken',
      img: loadImage('../assets/Indian proteins/proteins0.png')
    },
    {
      name: 'Egg',
      img: loadImage('../assets/Indian proteins/proteins1.png')
    },
    {
      name: 'Fish',
      img: loadImage('../assets/Indian proteins/proteins2.png')
    },
    {
      name: 'Tofu',
      img: loadImage('../assets/Indian proteins/proteins3.png')
    }
  ];


  IndianGrains = [{
      name: 'Arborio Rice',
      img: loadImage('../assets/Indian grains/grains0.png')
    },
    {
      name: 'Brown Rice',
      img: loadImage('../assets/Indian grains/grains1.png')
    },
    {
      name: 'White Rice',
      img: loadImage('../assets/Indian grains/grains2.png')
    },
    {
      name: 'Jasmine Rice',
      img: loadImage('../assets/Indian grains/grains3.png')
    }
  ];

  IndianSpices = [{
      name: 'Turmeric',
      img: loadImage('../assets/Indian spices/spices0.png')
    },
    {
      name: 'Salt',
      img: loadImage('../assets/Indian spices/spices1.png')
    },
    {
      name: 'Fried Onions',
      img: loadImage('../assets/Indian spices/spices2.png')
    },
    {
      name: 'Cloves',
      img: loadImage('../assets/Indian spices/spices3.png')
    }
  ];

  ChineseProteins = [{
      name: 'Pork Feet',
      img: loadImage('../assets/Chinese proteins/proteins0.png')
    },
    {
      name: 'Pork Belly',
      img: loadImage('../assets/Chinese proteins/proteins1.png')
    },
    {
      name: 'Spare Ribs',
      img: loadImage('../assets/Chinese proteins/proteins2.png')
    },
    {
      name: 'Front Pork Leg',
      img: loadImage('../assets/Chinese proteins/proteins3.png')
    }
  ];


  ChineseVeges = [{
      name: 'Ginger',
      img: loadImage('../assets/Chinese vege/vege0.png')
    },
    {
      name: 'Green Onions',
      img: loadImage('../assets/Chinese vege/vege1.png')
    },
    {
      name: 'Garlic',
      img: loadImage('../assets/Chinese vege/vege2.png')
    },
    {
      name: 'Green Pepper',
      img: loadImage('../assets/Chinese vege/vege3.png')
    }
  ];

  ChineseSpices = [{
      name: 'Salt',
      img: loadImage('../assets/Chinese spices/spices0.png')
    },
    {
      name: 'Fermented Soybeans',
      img: loadImage('../assets/Chinese spices/spices1.png')
    },
    {
      name: 'Soysauce',
      img: loadImage('../assets/Chinese spices/spices2.png')
    },
    {
      name: 'Sugar',
      img: loadImage('../assets/Chinese spices/spices3.png')
    }
  ];


}

function setup() {

  serial = new p5.SerialPort();
  serial.open("/dev/tty.usbmodem14201");
  serial.on('connected', serverConnected);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);

  if (layerName == "instructions") {
    instructions();
  }

  createCanvas(1584, 865);
  angleMode(DEGREES);
  ellipseMode(CENTER);
  imageMode(CENTER);

  bigBowl = new Bowl(792, 432, radforBig);

}


function rotateToMake() {
  fill(0);
  textSize(30);
  textFont(myFont);
  textAlign(CENTER, CENTER);




  if (layerName == "Indian") {

    //     text('TURN to make ' + '\n\n\n\nPush the button when you are done', width / 2, height / 2);
    text('TURN to Select From 3 Layers' + '\n\nPick Ingredients From the Bowl or Use the Spoon' + '\n\n\n\nPush the BUTTON When You Are Done', width / 2, height / 2);


    push();
    noStroke();
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text('\n\n\n\nIndian Biryani', width / 2, height / 2 - height / 20);
    pop();


    if (Indianlayer == "proteinLayer") {
      text('Indian PROTEIN Layer' + '(' + IndianLayerNum + '/3)', width / 2, height / 20);

    }
    if (Indianlayer == "spiceLayer") {
      text('Indian SPICE Layer' + '(' + IndianLayerNum + '/3)', width / 2, height / 20);

    }
    if (Indianlayer == "grainLayer") {
      text('Indian GRAIN Layer' + '(' + IndianLayerNum + '/3)', width / 2, height / 20);

    }

  } else if (layerName == "Chinese") {

    text('TURN to Select From 3 Layers' + '\n\nPick Ingredients From the Bowl or Use the Spoon' + '\n\n\n\nPush the BUTTON When You Are Done', width / 2, height / 2);

    push();
    noStroke();
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text('\n\n\n\nChinese Green Pepper with Pork', width / 2, height / 2 - height / 20);
    pop();

    if (Chineselayer == "proteinLayer") {
      text('Chinese PROTEIN Layer' + '(' + ChineseLayerNum + '/3)', width / 2, height / 20);

    }
    if (Chineselayer == "spiceLayer") {
      text('Chinese SPICE Layer' + '(' + ChineseLayerNum + '/3)', width / 2, height / 20);

    }
    if (Chineselayer == "vegeLayer") {
      text('Chinese VEGE Layer' + '(' + ChineseLayerNum + '/3)', width / 2, height / 20);

    }
  }
}

function timerforGame() {

  //60 seconds
  if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer--;
  }
  if (timer == 0) {
    layerName = "GameOver";
  }
  textFont(titleFont);
  textSize(50);
  fill(255, 0, 0);
  text(timer, width -200, height / 20);


}

function draw() {
  background(255);
  noStroke();

  //questions, how to empty the bowels when starting a new cuisine/layername 
  //when each new layername is updated, should start a new slate 
  //empty the array 
  //when you start the game, it cleans everything 

  if (layerName == "instructions") {
    fill(255);
    rect(0, 0, width, height);
    timer = 60;
    instructions();
    Chinesemusic.stop();
    Indianmusic.stop();

    gasstoveSound.stop();
    saltgrindingSound.stop();
    sizzlingmeatSound.stop();
    stirringSound.stop();
    choppingvegeSound.stop();
    droppingriceSound.stop();
    drumrollSound.stop();

    winningSound.stop();
    losingSound.stop();

    userIngredientsIndian = [];
    userIngredientsChinese = [];
  }


  if (layerName == "GameOn") {
    GameOn();
    if (!drumrollSound.isPlaying()) {
      drumrollSound.play();
    }
  }


  if (layerName == "IndianCuisineSelected") {
    GameOn();
    layerEffectIndian();


  }
  if (layerName == "ChineseCuisineSelected") {
    GameOn();
    layerEffectChinese();
  }

  if (layerName == "Indian") {
    fill(255);
    rect(0, 0, width, height);
    timerforGame();

    selectIndianLayers(IndianLayerNum);
    showfromUIIndian();

    if (drumrollSound.isPlaying()) {
      drumrollSound.stop();
    }


  }
  if (layerName == "Chinese") {
    fill(255);
    rect(0, 0, width, height);
    timerforGame();

    selectChineseLayers(ChineseLayerNum);
    showfromUIChinese();
    if (drumrollSound.isPlaying()) {
      drumrollSound.stop();
    }
  }

  rotateToMake();
  //how to hide the ingredients? - fixed 
  //but how to show the full ingredients again when press again? - Fixed 

  if ((layerName == "Indian") || (layerName == "Chinese")) {
    for (let i = 0; i < bowls.length; i++) {
      bowls[i].show();
    }
  }

  datafromUltrasonicSensor(latestData);


  //draw the big bowl 
  push();
  noFill();
  noStroke();
  ellipse(bigBowl.x, bigBowl.y, bigBowl.r);
  pop();

  if (layerName == "GameOver") {
    //stop all the sound but the background music 
    gasstoveSound.stop();
    saltgrindingSound.stop();
    sizzlingmeatSound.stop();
    stirringSound.stop();
    choppingvegeSound.stop();
    droppingriceSound.stop();
    drumrollSound.stop();
    
    
        //restart 
    score = 0
    timer = 60; //resets the timer // should reset for both layers 
    IndianLayerNum = 1;
    ChineseLayerNum = 1;
    Indianlayer = "grainLayer";
    Chineselayer = "proteinLayer";
    bowls = [];


    GameOver();

    //wait for 2 seconds and display another screen 
    if (frameCount % 60 == 0 && delayTimer > 0) {
      delayTimer--;
    }

    if (delayTimer == 0) {
      layerName = "AfterGameOver";
    }
  }


  if (layerName == "AfterGameOver") {

    AfterGameOver();
    delayTimer = 3;


  }
}

function GameOn() {

  //divde the screen 
  //only select one or the other 
  //indian biryani & chinese green pepper with pork 

  colorCounter += 5;
  if (colorCounter > 255) {
    colorCounter = 0;
  }

  push();
  fill(colorCounter);
  textSize(80);
  textFont(titleFont);
  text("TURN to select what to make", width / 2, height / 8);
  pop();

  strokeWeight(2);
  textSize(50);
  text("Indian Biryani", 0, 0, width / 2, height);
  text("Chinese Green Pepper with Pork", width / 2, 0, width / 2-100, height);

}

function layerEffectIndian() {

  rect(0, 0, width / 2, height);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Indian Biryani", 0, 0, width / 2, height / 3);
  image(indianDish, width / 4, height / 2, width / 4, width / 4);
  fill(colorCounter, colorCounter, 0);
  text("  \nPUSH to Confirm", 0, height / 2, width / 2, height / 2);

}

function layerEffectChinese() {

  rect(width / 2, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Chinese Green Pepper with Pork", width / 2, 0, width / 2-100, height / 3);
  image(chineseDish, width / 4 * 3, height / 2, width / 4, width / 4);
  fill(colorCounter, colorCounter, 0);
  text("  \n PUSH to Confirm", width / 2, height / 2, width / 2, height / 2);
}


function selectIndianLayers(IndianLayerNum) {
  if (layerName == "Indian") {

    if (!Indianmusic.isPlaying()) {
      Indianmusic.play();
    }

    if (IndianLayerNum == 1) {
      if (Indianlayer == "grainLayer") {
        Indianlayer = "proteinLayer";
        IndianProtein();


        if (!sizzlingmeatSound.isPlaying()) {
          sizzlingmeatSound.play();
        }

        if (droppingriceSound.isPlaying()) {
          droppingriceSound.stop();
        }
        if (choppingvegeSound.isPlaying()) {
          choppingvegeSound.stop();
        }
        if (saltgrindingSound.isPlaying()) {
          saltgrindingSound.stop();
        }
        // saltgrindingSound.stop();


      }
    }
    if (IndianLayerNum == 2) {
      if (Indianlayer == "proteinLayer") {
        Indianlayer = "spiceLayer";
        IndianSpice();

        //         droppingriceSound.stop();
        //         choppingvegeSound.stop();
        //         sizzlingmeatSound.stop();
        //         saltgrindingSound.play();

        if (sizzlingmeatSound.isPlaying()) {
          sizzlingmeatSound.stop();
        }

        if (droppingriceSound.isPlaying()) {
          droppingriceSound.stop();
        }
        if (choppingvegeSound.isPlaying()) {
          choppingvegeSound.stop();
        }
        if (!saltgrindingSound.isPlaying()) {
          saltgrindingSound.play();
        }
      }
    }
    if (IndianLayerNum == 3) {

      if (Indianlayer == "spiceLayer") {
        Indianlayer = "grainLayer";
        IndianGrain();

        //         droppingriceSound.play();
        //         choppingvegeSound.stop();
        //         sizzlingmeatSound.stop();
        //         saltgrindingSound.stop();

        if (sizzlingmeatSound.isPlaying()) {
          sizzlingmeatSound.stop();
        }

        if (droppingriceSound.isPlaying()) {
          droppingriceSound.stop();
        }
        if (!choppingvegeSound.isPlaying()) {
          choppingvegeSound.play();
        }
        if (saltgrindingSound.isPlaying()) {
          saltgrindingSound.stop();
        }

      }
    }
  }
}



function selectChineseLayers(ChineseLayerNum) {

  if (layerName == "Chinese") {

    if (!Chinesemusic.isPlaying()) {
      Chinesemusic.play();
    }
    //let the music keep playing - but no overlap - even when the encoder is twisting 
    //how to keep track how many times each layer is played - no need 

    if (ChineseLayerNum == 1) {
      if (Chineselayer == "proteinLayer") {
        Chineselayer = "vegeLayer";
        ChineseVege();

        // choppingvegeSound.play();
        // sizzlingmeatSound.stop();
        // saltgrindingSound.stop();
        // droppingriceSound.stop();
        // gasstoveSound.stop();


        if (sizzlingmeatSound.isPlaying()) {
          sizzlingmeatSound.stop();
        }

        if (droppingriceSound.isPlaying()) {
          droppingriceSound.stop();
        }
        if (!choppingvegeSound.isPlaying()) {
          choppingvegeSound.play();
        }
        if (saltgrindingSound.isPlaying()) {
          saltgrindingSound.stop();
        }
        if (gasstoveSound.isPlaying()) {
          gasstoveSound.stop();
        }


        //start playing the bgm when default layer is 1 


      }

    }
  }
  if (ChineseLayerNum == 2) {
    if (Chineselayer == "vegeLayer") {
      Chineselayer = "spiceLayer";
      ChineseSpice();

      // choppingvegeSound.stop();
      // sizzlingmeatSound.stop();
      // droppingriceSound.stop();
      // saltgrindingSound.play();
      // gasstoveSound.stop();

      if (sizzlingmeatSound.isPlaying()) {
        sizzlingmeatSound.stop();
      }

      if (droppingriceSound.isPlaying()) {
        droppingriceSound.stop();
      }
      if (choppingvegeSound.isPlaying()) {
        choppingvegeSound.stop();
      }
      if (!saltgrindingSound.isPlaying()) {
        saltgrindingSound.play();
      }
      if (!gasstoveSound.isPlaying()) {
        gasstoveSound.stop();
      }

    }
  }
  if (ChineseLayerNum == 3) {

    if (Chineselayer == "spiceLayer") {
      Chineselayer = "proteinLayer";
      ChineseProtein();

      // choppingvegeSound.stop();
      // sizzlingmeatSound.play();
      // droppingriceSound.stop();
      // saltgrindingSound.stop();
      // gasstoveSound.play();


      if (!sizzlingmeatSound.isPlaying()) {
        sizzlingmeatSound.play();
      }

      if (droppingriceSound.isPlaying()) {
        droppingriceSound.stop();
      }
      if (choppingvegeSound.isPlaying()) {
        choppingvegeSound.stop();
      }
      if (saltgrindingSound.isPlaying()) {
        saltgrindingSound.stop();
      }
      if (!gasstoveSound.isPlaying()) {
        gasstoveSound.play();
      }



    }
  }

}

function ChineseVege() {
  fillBowls(ChineseVeges);
}

function ChineseProtein() {
  fillBowls(ChineseProteins);

}

function ChineseSpice() {
  fillBowls(ChineseSpices);
}

function IndianGrain() {
  fillBowls(IndianGrains);
}

function IndianProtein() {
  fillBowls(IndianProteins);
  // console.log("indian protein");
}

function IndianSpice() {
  fillBowls(IndianSpices);
}

function fillBowls(layerSelection) {

  bowls[0] = new Bowl(bowlOne.x, bowlOne.y, radforSmall, layerSelection[0].img, layerSelection[0].name);
  bowls[1] = new Bowl(bowlTwo.x, bowlTwo.y, radforSmall, layerSelection[1].img, layerSelection[1].name);
  bowls[2] = new Bowl(bowlThree.x, bowlThree.y, radforSmall, layerSelection[2].img, layerSelection[2].name);
  bowls[3] = new Bowl(bowlFour.x, bowlFour.y, radforSmall, layerSelection[3].img, layerSelection[3].name);

}

function showfromUIIndian() {
  //appear on the surrounding of the big bowls 
  //have to separate from two cuisines 

  if ((userIngredientsIndian.length > 0) && (layerName == "Indian")) {
    indianLayerResult = true;
    chineseLayerResult = false;

    for (let m = 0; m < userIngredientsIndian.length; m++) {
      push();
      translate(width / 2, height / 2);
      // let rotationAngle =radians(m*180);
      let rotationAngle = m * 20;
      rotate(rotationAngle); //assume there are 5 ingredients

      // 𝑥=𝑟sin𝜃, 𝑦=𝑟cos𝜃.
      let radiusDiff = radforBig / 2 - radforSmall / 1.5;

      let x = sin(rotationAngle) * radiusDiff;
      let y = cos(rotationAngle) * radiusDiff;

      image(userIngredientsIndian[m].img, x, -y, radforSmall / 1.5, radforSmall / 1.5);
      console.log(userIngredientsIndian[m].name);
      pop();

    }
  }


}

function showfromUIChinese() {
  //appear on the surrounding of the big bowls 
  //have to separate from two cuisines 

  if ((userIngredientsChinese.length > 0) && (layerName == "Chinese")) {
    chineseLayerResult = true;
    indianLayerResult = false;

    for (let m = 0; m < userIngredientsChinese.length; m++) {
      push();
      translate(width / 2, height / 2);
      // let rotationAngle =radians(m*180);
      let rotationAngle = m * 20;
      rotate(rotationAngle); //assume there are 5 ingredients

      // 𝑥=𝑟sin𝜃, 𝑦=𝑟cos𝜃.
      let radiusDiff = radforBig / 2 - radforSmall / 1.5;

      let x = sin(rotationAngle) * radiusDiff;
      let y = cos(rotationAngle) * radiusDiff;

      image(userIngredientsChinese[m].img, x, -y, radforSmall / 1.5, radforSmall / 1.5);
      console.log(userIngredientsChinese[m].name);
      pop();


    }
  }

}


//if there are repeated in the useringredients - just take one √
//right ones are filled in green √
//wrong ones are filled in red √
//correct ones but not taken are black 

//needs work on it - needs to fulfill all the ingredients √

function percentageScore(userIngredients, rightIngredients) {

  UISelected = [];
  //create an array with all the names 
  for (let i = 0; i < userIngredients.length; i++) {

    UISelected.push(userIngredients[i].name);
  }

  let Rightcounter = 0; //can't put it globally, will constantly increase
  let Wrongcounter = 0;
  //delete duplicates 
  uniqueUISelected = [...new Set(UISelected)];

  for (let u = 0; u < uniqueUISelected.length; u++) {
    if (rightIngredients.indexOf(uniqueUISelected[u]) > -1) {
      Rightcounter++;
    } else {
      //if they choose wrong, have to take it into account     
      Wrongcounter++;
    }
  }

  //have to separate the rightcounter or wrongcounter 
  console.log("counter" + (Rightcounter - Wrongcounter));

  if (userIngredients.length <= rightIngredients.length) {
    score = floor(((Rightcounter - Wrongcounter) / rightIngredients.length) * 100);

  } else {

    score = floor((Rightcounter / userIngredients.length) * 100);

  }
  if (score > 60) {
    // display the image of correct traditional cuisine
    losingSound.stop();

    //sound effect - yay children voices 
    if (!winningSound.isPlaying()) {
      winningSound.play();
    }
  } else {
    //sound effect - uh oh 
    winningSound.stop();

    if (!losingSound.isPlaying()) {
      losingSound.play();
      // display a blurred animation of the image 
    }

    //don't like the picture shown in the background 
    // if(indianLayerResult){
    //     image(indianDish,bigBowl.x, bigBowl.y, bigBowl.r,bigBowl.r);

    // }
    // if(chineseLayerResult){
    //     image(chineseDish,bigBowl.x, bigBowl.y, bigBowl.r,bigBowl.r);

    // }
    //display the images 
  }

  //display the percentage
  push();
  textSize(100);
  fill(240, 100, 100);
  text('You are ' + score + ' %' + ' correct!', width / 2, height / 2.3);
  pop();

}

function percentageDetails(userIngredients, rightIngredients) {

  push();
  let rightresult = '';
  let wrongresult = '';
  for (let l = 0; l < uniqueUISelected.length; l++) {
    if (rightIngredients.indexOf(uniqueUISelected[l]) > -1) {

      rightresult += uniqueUISelected[l];
      rightresult += '\n';
      // result += uniqueUISelected[l];

    } else {
      wrongresult += uniqueUISelected[l] + '\n';
    }
  }

  push();
  fill(0, 255, 0);
  textLeading(lead);
  text('You chose right:', width / 2, height / 7);
  text(rightresult, width / 2, height / 2);
  pop();

  push();
  fill(255, 0, 0);
  textLeading(lead);
  text('You chose wrong:', width / 10 * 7, height / 7);
  text(wrongresult, width / 10 * 7, height / 2);

  pop();

  pop();


}


function instructions() {
  // background(255);
  fill(255);
  rect(0, 0, width, height);
  fill(255, 226, 79);

  push();
  noStroke();
  textFont(titleFont);
  textSize(150);
  textAlign(CENTER);
  text('Authentic or Not', width / 2, height / 5);
  push();
  fill(0);
  textSize(90);
  text('Create a traditional dish!', width / 2, height / 2);
  pop();
  pop();

  colorCounter += 5;
  if (colorCounter > 255) {
    colorCounter = 0;
  }

  fill(colorCounter);
  textFont(myFont);
  textSize(50);
  textAlign(CENTER, CENTER);
  text('Push the button', width / 2, height / 5 * 4);


}

function GameOver() {

  //display gameover, and score
  fill(255);
  rect(0, 0, width, height);


  if (chineseLayerResult) {

    percentageScore(userIngredientsChinese, ChineseRightIngredients);
  }
  if (indianLayerResult) {

    percentageScore(userIngredientsIndian, IndianRightIngredients);
  }


  push();
  noStroke();
  fill(255, 226, 79);
  textFont(titleFont);
  textSize(150);
  textAlign(CENTER);
  text('Authentic or Not', width / 2, height / 4 - 50);
  push();
  fill(0);
  textSize(80);
  text('END OF THE GAME!', width / 2, height / 5 * 3.5);
  pop();
  pop();

  fill(0);
  textSize(25);
  textAlign(CENTER, CENTER);

  text('Thank you for playing our game.', width / 2, height / 8 * 6.5);


}

function AfterGameOver() {
  //display detailes of ingredients and scan 
  fill(255);
  rect(0, 0, width, height);


  for (let indian = 0; indian < userIngredientsIndian.length; indian++) {
    console.log("indian ingredients at game end:" + userIngredientsIndian[indian].name);
    // userIngredientsIndian=[];
  }

  for (let chinese = 0; chinese < userIngredientsChinese.length; chinese++) {
    console.log("chinese ingredients at game end:" + userIngredientsChinese[chinese].name);
    // userIngredientsChinese=[];

  }


  if (indianLayerResult) {
    let wordsIndian = '';
    for (let i = 0; i < IndianRightIngredients.length; i++) {
      wordsIndian += IndianRightIngredients[i] + '\n';
    }

    push();
    fill(0);
    textLeading(lead);
    text('Right ingredients:', width / 3.5, height / 7);
    text(wordsIndian, width / 3.5, height / 2);
    percentageDetails(userIngredientsIndian, IndianRightIngredients);
    pop();
  }

  if (chineseLayerResult) {
    let wordsChinese = '';
    for (let i = 0; i < ChineseRightIngredients.length; i++) {
      wordsChinese += ChineseRightIngredients[i] + '\n';
    }

    push();
    fill(0);
    textLeading(lead);
    text('Right ingredients:', width / 3.5, height / 7);
    text(wordsChinese, width / 3.5, height / 2);
    percentageDetails(userIngredientsChinese, ChineseRightIngredients);
    pop();
  }

  push();
  fill(0);
  strokeWeight(1);
  stroke(0);
  text('Scan the barcode to collect the traditional recipes ' + '\n' + 'of Indian and Chinese cuisine', width / 2, height / 8 * 6.5);
  pop();


}