#include<Servo.h>

// Changeable pins
const int joyStickXPin = A0;
const int joyStickYPin = A1; 
const int joyStickClickPin = 2; 
const int tiltPin = 3;
const int panPin = 4;
const int addButtonPin = 5;
const int removeButtonPin = 6;

const int minServoOffset = -5;
const int maxServoOffset = 5;
const int servoDelay = 15;
const int doNothingVal = -1;

// Temp variables to receive raw input and calc offsets
int servoVal = 0;
int joystickVal = 0;
int buttonState;
int prevMillis = 0;
int temp;

// Hashed Values
int prevPanVal = 90;
int prevTiltVal = 90;
int prevAddButtonState = 0;
int prevRemoveButtonState = 0;
int prevJoystickButtonState = 0;

Servo pan;
Servo tilt;

void setup() {
  pan.attach(panPin);
  tilt.attach(tiltPin);

  pinMode(joyStickClickPin, INPUT_PULLUP);
  pinMode(addButtonPin, INPUT_PULLUP);
  pinMode(removeButtonPin, INPUT_PULLUP);
  
  Serial.begin(9600);
}

void loop() {

  // Used to delay moving servos until they reach the previous position
  if (prevMillis - millis() >= servoDelay) { 

    prevMillis = millis();
    
    joystickVal = analogRead(joyStickXPin);
    temp = map(joystickVal, 0, 1023, minServoOffset, maxServoOffset);
    
    servoVal = prevPanVal;
    servoVal += temp;

    constrain(servoVal, 0, 179);
    
    // Write pan val first
    Serial.write(servoVal);
    Serial.write(" ");
    pan.write(servoVal);

    prevPanVal = servoVal;
  
    joystickVal = analogRead(joyStickYPin);
    temp = map(joystickVal, 0, 1023, minServoOffset, maxServoOffset);
    
    servoVal = prevTiltVal;
    servoVal += temp;

    constrain(servoVal, 0, 179);
    
    // Write tilt val second
    Serial.write(servoVal);
    Serial.write(" ");
    tilt.write(servoVal);

    prevTiltVal = servoVal;
    } else {
    // Write prev servo vals
    Serial.write(prevPanVal);
    Serial.write(" ");
    Serial.write(prevTiltVal);
    Serial.write(" ");
  }

  buttonState = digitalRead(addButtonPin);

  if (buttonState != prevAddButtonState) {
    prevAddButtonState = buttonState;
    
    // Write add button state third
    Serial.write(buttonState);
    Serial.write(" ");
  } else {
    Serial.write(doNothingVal);
    Serial.write(" ");
  }

  buttonState = digitalRead(removeButtonPin);

  if (buttonState != prevRemoveButtonState) {
    prevRemoveButtonState = buttonState;
    
    // Write remove button state fourth
    Serial.write(buttonState);
    Serial.write(" ");
  } else {
    Serial.write(doNothingVal);
    Serial.write(" ");
  }

  
  buttonState = digitalRead(joyStickClickPin);

  if (buttonState != prevJoystickButtonState) {
    prevJoystickButtonState = buttonState;
    
    // Write joystick button state fifth
    Serial.write(buttonState);
    Serial.write("\n");
  } else {
    Serial.write(doNothingVal);
    Serial.write("\n");
  }
}
