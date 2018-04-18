#include<Servo.h>

// Changeable pins
const int joystickYPin = A0; 
const int joystickXPin = A1;
const int tiltPin = 3;
const int panPin = 4;

const int minServoOffset = -4;
const int maxServoOffset = 4;

// Temp variables to receive raw input and calc offsets
int servoVal = 0;
int joystickVal = 0;
int buttonState;
int temp = 0;

// Hashed Values
int prevPanVal = 90;
int prevTiltVal = 90;

Servo pan;
Servo tilt;

void setup() {
//  pan.attach(panPin);
//  tilt.attach(tiltPin);
  
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
  Serial.print("X: ");
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
  Serial.print("Y: ");
  Serial.print(179 - servoVal);
  Serial.println();
  tilt.write(servoVal);
}
