#include<Servo.h>

// Changeable pins
const int joystickYPin = A0; 
const int joystickXPin = A1;
const int joystickClickPin = 2; 
const int tiltPin = 3;
const int panPin = 4;
const int addButtonPin = 5;
const int removeButtonPin = 6;

const int minServoOffset = -4;
const int maxServoOffset = 4;
const int doSomethingVal = 1;
const int doNothingVal = 0;

// Temp variables to receive raw input and calc offsets
int servoVal = 0;
int joystickVal = 0;
int buttonState;
int temp = 0;

// Hashed Values
int prevPanVal = 90;
int prevTiltVal = 90;
int prevAddButtonState = 0;
int prevRemoveButtonState = 0;
int prevjoystickButtonState = 0;

Servo pan;
Servo tilt;

void setup() {
  pan.attach(panPin);
  tilt.attach(tiltPin);

  pinMode(joystickClickPin, INPUT_PULLUP);
  pinMode(addButtonPin, INPUT_PULLUP);
  pinMode(removeButtonPin, INPUT_PULLUP);
  
  Serial.begin(9600);
}

void loop() {

  // Move pan
  joystickVal = analogRead(joystickXPin);
  temp = map(joystickVal, 0, 1023, minServoOffset, maxServoOffset);

  // To decrease sensitivity
  if (temp >= -1 && temp <= 1) {
    temp = 0;
  }
  
  servoVal = prevPanVal + temp;
  servoVal = constrain(servoVal, 0, 179);
  prevPanVal = servoVal;
  
  // Write pan val first
  // It is flipped for the p5 canvas
  Serial.print(179 - servoVal);
  Serial.print(" ");
  pan.write(servoVal);

  // Move tilt
  joystickVal = analogRead(joystickYPin);
  
  // For controller, tilt is swapped due to the direction laser moves
  joystickVal = 1023 - joystickVal;    
  
  temp = map(joystickVal, 0, 1023, minServoOffset, maxServoOffset);

  // To decrease sensitivity
  if (temp >= -1 && temp <= 1) {
    temp = 0;
  }
  
  servoVal = prevTiltVal + temp;
  servoVal = constrain(servoVal, 0, 179);
  prevTiltVal = servoVal;
  
  // Write tilt val second
  // It is flipped for the p5 canvas
  Serial.print(179 - servoVal);
  Serial.print(" ");
  tilt.write(servoVal);

  buttonState = digitalRead(addButtonPin);

  if (buttonState != prevAddButtonState) {
    prevAddButtonState = buttonState;
    
    // Write add button state third
    // 0 is on in INPUT_PULLUP
    if (buttonState == 0) {
      Serial.print(doSomethingVal);
      Serial.print(" ");
    } else {
      Serial.print(doNothingVal);
      Serial.print(" ");
    }
  } else {
    Serial.print(doNothingVal);
    Serial.print(" ");
  }

  buttonState = digitalRead(removeButtonPin);

  if (buttonState != prevRemoveButtonState) {
    prevRemoveButtonState = buttonState;
    
    // Write remove button state fourth
    // 0 is on in INPUT_PULLUP
    if (buttonState == 0) {
      Serial.print(doSomethingVal);
      Serial.print(" ");
    } else {
      Serial.print(doNothingVal);
      Serial.print(" ");
    }
  } else {
    Serial.print(doNothingVal);
    Serial.print(" ");
  }

  
  buttonState = digitalRead(joystickClickPin);

  if (buttonState != prevjoystickButtonState) {
    prevjoystickButtonState = buttonState;
    
    // Write joystick button state fifth
    // 0 is on in INPUT_PULLUP
    if (buttonState == 0) {
      Serial.print(doSomethingVal);
      Serial.println();
    } else {
      Serial.print(doNothingVal);
      Serial.println();
    }
  } else {
    Serial.print(doNothingVal);
    Serial.println();
  }
}
