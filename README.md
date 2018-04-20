# Word Jam
### A tetris-like, story making game… with a laser!

Word Jam is a game that lets the player create stories from randomly generated words. Players can add random words, delete random words, and move words from one position to another in order to try to create a story. Word Jam is best played as a projection on a screen with its physical controller, which uses a joystick that controls a laser to move around the screen; it can also be played on a computer screen using the mouse and keyboard as a controller. 

## Instructions

### With the Arduino Controller

First, project the laptop onto a larger physical surface. If necessary, change the pins in the Arduino programs to reflect the setup.

Run the Calibration Arduino program and move the laser to the top left and bottom right positions of the projected screen. These values will be modified in the `sketch.js` min and max X and Y values. Once these values have been recorded, we are ready to begin. Ensure that the flag in `sketch.js` to use the Arduino controller is enabled, and that the port used for the Arduino is changed. 

To begin Word Jam, connect the Arduino to the computer, upload `Word_Story.ino`, and run

```shell
$ npm start
```

Next, open `index.html`. 

If everything works well, a cursor should appear on screen in the center.

#### Controls
* Joystick to move the laser and on screen cursor
* Green button to add a random word
* Red button to delete the word located on the cursor
* Joystick click on a word to grab and release it (to change its position)

### Without the Arduino Controller

Simply change the Arduino enabled flag in `sketch.js` to `false` and open `index.html` to begin the game! No need to run the node server.

#### Controls
* Mouse to move
* (P)ush a random word
* (R)emove the word located on the cursor
* Mouse click on a word to grab and release it (to change its position)
