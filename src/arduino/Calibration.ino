#include<Servo.h>

// Changeable pins
const int panPin = 2;
const int tiltPin = 3;
const int joystickXPin = 4;
const int joystickYPin = 5;

// Calibrated Midpoint of Joystick
const int joystickMidX = 512;
const int joystickMidY = 512;

// Temp variables to receive raw input and calc offsets
int servoVal = 0;
int offset = 0;

// Rough Midpoint of Joystick (0, 0)
// May need to be calibrated
int prevJoystickX = joystickMidX;
int prevJoystickY = joystickMidY;

Servo pan;
Servo tilt;

void printRawJoystickValues() {
  Serial.print("Raw Joystick X: ");
  Serial.println(analogReady(joyStickXPin));
  Serial.print("Raw Joystick Y: ");
  Serial.println(analogReady(joyStickYPin));
}

void setup() {
  pan.attach(2);
  tilt.attach(3);

  Serial.begin(9600);
}

void loop() {

  printRawJoystickValues();

  // Calculate adjusted joystick X
  offset = prevJoystickX - joystickMidX;
  servoVal = analogReady(joyStickXPin);
  servoVal += offset;
  constrain(servoVal, 0, 1023);

  prevJoystickX = servoVal;

  // Map adjusted joystick val to pan val
  servoVal = map(servoVal, 0, 1023, 0, 179);

  Serial.print("Pan Val: ");
  Serial.println(servoVal);

  pan.write(servoVal);

  // Calculate adjusted joystick Y
  offset = prevJoystickY - joystickMidY;
  servoVal = analogReady(joyStickYPin);
  servoVal += offset;
  constrain(servoVal, 0, 1023);

  prevJoystickY = servoVal;

  // Map adjusted joystick val to tilt val
  servoVal = map(servoVal, 0, 1023, 0, 179);

  Serial.print("Tilt Val: ");
  Serial.println(servoVal);

  tilt.write(servoVal);

  // delay till servo reaches position
  delay(15);
}
