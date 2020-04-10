//pushbutton selects the dishes
//encoder selects the ingredients
//QR code will be projected onto the big bowl
//Create design elements to be engraved onto the the surface
//Create larger size of the encoder knob
//Carve a spoon onto the bowl


//Questions: how to only read the sensor only when the encoder is selected
//how to only count encoder -- should have the lasteststate

#include <SimpleRotary.h>

// Pin A, Pin B, Button Pin
SimpleRotary rotary(11, 12, 13);

int indianRotaryCounter = 0;
int chineseRotaryCounter = 0;
String layerName = "instructions";

boolean readsensorafterencoder = false;
int rotateCuisineCounter = 0;
boolean chinesecuisine = false;
boolean indiancuisine = false;

unsigned long previousMillis = 0;
float endTime = 10000; //wait for 10 seconds and then return to game on mode

const int  buttonPin = 10;    // the pin that the pushbutton is attached to

// Variables will change:
int buttonPushCounter = 0;   // counter for the number of button presses
int buttonState = 0;         // current state of the button
int lastButtonState = 0;     // previous state of the button


//tbd
//int encoderState = 0;
//int lastEncoderState = 0;
//int EncoderbuttonPushCounter = 0;

int IndianLastEncoderState = 0;
int ChineseLastEncoderState = 0;

int trigPin1 = 2;
int echoPin1 = 3;

int trigPin2 = 4;
int echoPin2 = 5;

int trigPin3 = 6;
int echoPin3 = 7;

int trigPin4 = 8;
int echoPin4 = 9;

int threshold = 10;

void setup() {

  // Set the trigger to be either a HIGH or LOW pin (Default: HIGH)
  // Note this sets all three pins to use the same state.
  rotary.setTrigger(HIGH);
  // Set the debounce delay in ms  (Default: 2)
  rotary.setDebounceDelay(5);
  // Set the error correction delay in ms  (Default: 200)
  //  rotary.setErrorDelay(250);
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);

  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);

  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  pinMode(trigPin3, OUTPUT);
  pinMode(echoPin3, INPUT);

  pinMode(trigPin4, OUTPUT);
  pinMode(echoPin4, INPUT);
}

void loop() {
  buttonState = digitalRead(buttonPin);

  //push it once - start the game, twist the knob to select the cuisine types
  //push it twice - select the layers of the corresponding cuisine
  //push it three times - end the game

  if (buttonState != lastButtonState) {
    // if the state has changed, increment the counter
    if (buttonState == LOW) {
      buttonPushCounter++;
      // if the current state is LOW then the button went from off to on:
      if (buttonPushCounter % 4 == 1) {
        Serial.println("instructions");
        layerName = "instructions";

        //should have delay, otherwise, would register more clicks on the pushbutton
        delay(100);

      } else   if (buttonPushCounter % 4 == 2) {
        Serial.println("GameOn");
        layerName = "GameOn";

        //should have delay, otherwise, would register more clicks on the pushbutton
        delay(100);
      }
      else if (buttonPushCounter % 4 == 3) {
        //move on to the layer part
        if (indiancuisine) {
          layerName = "Indian";
          Serial.println("IndianLayerSelected");

        } else   if (chinesecuisine) {
          Serial.println("ChineseLayerSelected");
          layerName = "Chinese";
        }
        delay(100);


      } else  if (buttonPushCounter % 4 == 0) {
        Serial.println("GameOver");
        layerName = "GameOver";
        delay(100);

      }
    }
    lastButtonState = buttonState;

  }
  conditions();

}

void conditions() {
  if (layerName == "GameOn") {
//    reboot();
    choosecuisine();
  }
  else if (layerName == "Indian") {

    indianLayer();
  }

  else if (layerName == "Chinese") {
    chineseLayer();
  }

//  else if (layerName == "GameOver") {
//
//
//  }

}

//void reboot() {
//
//  indianRotaryCounter = 0;
//  chineseRotaryCounter = 0;
//
//}

void choosecuisine() {

  byte rotateCuisine = rotary.rotate();

  if (rotateCuisine == 1) {
    if (rotateCuisineCounter % 2 == 0) {
      Serial.println("IndianCuisineSelected");
      indiancuisine = true;
      chinesecuisine = false;

    }
    if (rotateCuisineCounter % 2 == 1) {
      Serial.println("ChineseCuisineSelected");
      chinesecuisine = true;
      indiancuisine = false;
    }
    rotateCuisineCounter++;
  }

}


void indianLayer() {

  if (readsensorafterencoder) {
    readEachSensor();
  }
  if (indiancuisine) {
    byte indianRotate = rotary.rotate();
    if (indianRotate != IndianLastEncoderState) {

      if (indianRotate == 1) {
        indianRotaryCounter++;
        if (indianRotaryCounter % 3 == 0)  {
          //select layer 3 - spice layer
          Serial.println("IndianL1");
          readsensorafterencoder = true;
        }
        else if (indianRotaryCounter % 3 == 1) {
          //select layer 1 - grain layer
          Serial.println("IndianL2");
          readsensorafterencoder = true;

        }
        else if (indianRotaryCounter % 3 == 2)  {
          //select layer 2 - protein layer
          Serial.println("IndianL3");
          readsensorafterencoder = true;

        }
      }
      indianRotate = IndianLastEncoderState;

    }
  }
}

void chineseLayer() {
  if (readsensorafterencoder) {
    readEachSensor();
  }

  if (chinesecuisine) {
    byte chineseRotate = rotary.rotate();
    if (chineseRotate != ChineseLastEncoderState) {

      if (chineseRotate == 1) {
        if (chineseRotaryCounter % 3 == 0)  {

          //select layer 3 - spice layer
          Serial.println("ChineseL1");
          readsensorafterencoder = true;

        }
        else if (chineseRotaryCounter % 3 == 1) {

          //select layer 1 - grain layer
          Serial.println("ChineseL2");
          readsensorafterencoder = true;

        }
        else if (chineseRotaryCounter % 3 == 2)  {

          //select layer 2 - protein layer
          Serial.println("ChineseL3");
          readsensorafterencoder = true;

        }
        chineseRotaryCounter++;

      }
    }
    chineseRotate = ChineseLastEncoderState;

  }

}

void readEachSensor() {
  firstsensor();
  secondsensor();
  thirdsensor();
  fourthsensor();
  delay(100);

}

void firstsensor() { // This function is for first sensor.
  int duration1, distance1;
  digitalWrite (trigPin1, HIGH);
  delayMicroseconds (10);
  digitalWrite (trigPin1, LOW);
  duration1 = pulseIn (echoPin1, HIGH);
  distance1 = (duration1 / 2) / 29.1;

  //  Serial.print("1st Sensor: ");
  //  Serial.print(distance1);
  //  Serial.print("cm  ");
  if (distance1 <= threshold) {
    Serial.print("S1");
    Serial.println(',');
    delay(1000);
  }
}
void secondsensor() { // This function is for second sensor.
  int duration2, distance2;
  digitalWrite (trigPin2, HIGH);
  delayMicroseconds (10);
  digitalWrite (trigPin2, LOW);
  duration2 = pulseIn (echoPin2, HIGH);
  distance2 = (duration2 / 2) / 29.1;
//        Serial.print("2nd Sensor: ");
//        Serial.print(distance2);
//        Serial.println("cm  ");
  if (distance2 <= 7) {
    Serial.print("S2");
    Serial.println(',');
    delay(1000);

  }
}
void thirdsensor() { // This function is for third sensor.
  int duration3, distance3;
  digitalWrite (trigPin3, HIGH);
  delayMicroseconds (10);
  digitalWrite (trigPin3, LOW);
  duration3 = pulseIn (echoPin3, HIGH);
  distance3 = (duration3 / 2) / 29.1;
  //    Serial.print("3rd Sensor: ");
  //    Serial.print(distance3);
  //    Serial.print("cm  ");

  if (distance3 <= threshold) {
    Serial.print("S3");
    Serial.println(',');
    delay(1000);
  }
}


void fourthsensor() { // This function is for third sensor.
  int duration4, distance4;
  digitalWrite (trigPin4, HIGH);
  delayMicroseconds (10);
  digitalWrite (trigPin4, LOW);
  duration4 = pulseIn (echoPin4, HIGH);
  distance4 = (duration4 / 2) / 29.1;

  //    Serial.print("4th Sensor: ");
  //    Serial.print(distance4);
  //    Serial.println("cm  ");
  if (distance4 <= threshold) {
    Serial.print("S4");
    Serial.println(',');
    delay(1000);

  }
}
