# Word Story

Word Story is a game projected onto a medium using an Arduino powered controller that's used to create stories with randomly generated words!

## Instructions

### With the Arduino Controller

First, project the laptop screen to a medium, such as a wall. If necessary, change the pins in the Arduino programs to reflect the setup.
Run the Calibration Arduino program and move the laser to the top left and bottom right positions of the projected screen. These values will be modified in the `sketch.js` min and max X and Y values. Once these values have been recorded, we are ready to begin. Ensure that the flag in `sketch.js` to use the Arduino controller is enabled, and that the port used for the Arduino is changed. 

To begin Word Story, connect the Arduino to the computer, upload `Word_Story.ino`, and run

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
