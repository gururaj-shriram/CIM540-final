#include<Servo.h>

// Changeable pins
const int joyStickXPin = A0;
const int joyStickYPin = A1; 
const int joyStickClickPin = 2; 
const int tiltPin = 3;
const int panPin = 4;
const int addButtonPin = 5;
const int removeButtonPin = 6;

int servoVal;

Servo pan;
Servo tilt;

void printRawJoystickValues() {
  Serial.print("Raw Joystick X: ");
  Serial.print(analogRead(joyStickXPin));
  Serial.print(" Raw Joystick Y: ");
  Serial.print(analogRead(joyStickYPin));
  Serial.print(" Raw Joystick Click: ");
  Serial.print(!digitalRead(joyStickClickPin));
  Serial.print(" Add Button: ");
  Serial.print(!digitalRead(addButtonPin));
  Serial.print(" Remove Button: ");
  Serial.print(!digitalRead(removeButtonPin));
}

void setup() {
  pan.attach(panPin);
  tilt.attach(tiltPin);
  
  Serial.begin(9600);
  pinMode(joyStickClickPin, INPUT_PULLUP);
  pinMode(addButtonPin, INPUT_PULLUP);
  pinMode(removeButtonPin, INPUT_PULLUP);
}

void loop() {

  printRawJoystickValues();

  servoVal = analogRead(joyStickXPin);
  servoVal = map(servoVal, 0, 1023, 0, 179);

  Serial.print(" Pan Val: ");
  Serial.print(servoVal);

  pan.write(servoVal);

  servoVal = analogRead(joyStickYPin);
  servoVal = map(servoVal, 0, 1023, 0, 179);

  Serial.print(" Tilt Val: ");
  Serial.println(servoVal);

  tilt.write(servoVal);
  
  // delay till servo reaches position
  delay(15);
}
