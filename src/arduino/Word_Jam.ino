#include<Servo.h>

// The joystick on the controller is rotated 90 degrees counterclockwise
// from where it should be. Hence, "X" corresponds to the "Y" direction
// and vice-a-versa. The "Y" on the joystick ("X" for the controller) is flipped, 
// so that 0 is actually 1023 and vice-a-versa. The "X" on the joystick ("Y" for the 
// controller) is flipped for practical purposes since the pan and tilt device is
// inverted to allow the laser to move higher

// Changeable pins
const int joystickYPin = A0; 
const int joystickXPin = A1;
const int joystickClickPin = 2; 
const int tiltPin = 3;
const int panPin = 4;
const int addButtonPin = 6;
const int removeButtonPin = 5;

const int minPanValue = 600;
const int maxPanValue = 2300;
const int minTiltValue = 900;
const int maxTiltValue = 2300;
const int minServoOffset = -3;
const int maxServoOffset = 3;
const int doSomethingVal = 1;
const int doNothingVal = 0;

// Temp variables to receive raw input and calc offsets
int servoVal = 0;
int joystickVal = 0;
int buttonState;
int temp = 0;

// Hashed Values
int prevPanVal = 1500;
int prevTiltVal = minTiltValue;
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
  
  // Add/Subtract a small offset so that the movements are relatively smooth
  servoVal = prevPanVal + temp;
  servoVal = constrain(servoVal, minPanValue, maxPanValue); // in case it's over the threshold
  prevPanVal = servoVal;
  
  // Write pan val first
  // It is flipped for the p5 canvas
  Serial.print(maxPanValue - servoVal);
  Serial.print(" ");
  pan.writeMicroseconds(servoVal);

  // Move tilt
  joystickVal = analogRead(joystickYPin);  
  temp = map(joystickVal, 0, 1023, minServoOffset, maxServoOffset);

  // To decrease sensitivity
  if (temp >= -1 && temp <= 1) {
    temp = 0;
  }

  // Add/Subtract a small offset so that the movements are relatively smooth
  servoVal = prevTiltVal + temp;
  servoVal = constrain(servoVal, minTiltValue, maxTiltValue); // in case it's over the threshold
  prevTiltVal = servoVal;
  
  // Write tilt val second
  // It is flipped for the p5 canvas
  Serial.print(maxTiltValue - servoVal);
  Serial.print(" ");
  tilt.writeMicroseconds(servoVal);

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
