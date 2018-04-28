# CIM540 Final Project: Word Jam
### A tetris-like, story making game… with a laser!

Word Jam is a game that lets the player create stories from randomly generated words. Players can add random words, delete random words, and move words from one position to another in order to try to create a story. Word Jam is best played as a projection on a screen with its physical controller, which uses a joystick that controls a laser to move around the screen; it can also be played on a computer screen using the mouse and keyboard as a controller. 

### Authors 

* Gururaj Shriram (physical computing)
* Jerry Bonnell (front-end)

## Instructions

### With the Arduino Controller

Note: To use the Arduino Controller, the Node framework must be used which can be downloaded using [these instructions](https://nodejs.org/en/download/).

First, project the game's canvas onto a larger physical surface or a screen. If necessary, change the pins in `Word_Jam.ino`, the Arduino serial port in `sketch.js`, and/or the flag `IS_USING_ARDUINO_CONTROLLER` in `sketch.js` to reflect the setup. 

To begin Word Jam, connect the Arduino to the computer, upload `Word_Jam.ino`, and run:

```shell
$ npm install
$ npm start
```

Next, open `index.html` in a browser. Opening this file should not be done on the server side (e.g. `localhost:PORT/index.html`) due to the usage of the p5 Serial library. Instead, it should be directly opened with its relative path (e.g. `file://WordJam/index.html`). 

Because p5 Serial is used in tandem with the p5 Sound library, which requires a local server to be used, the current program may not work on `Google Chrome` because its browser security features do not allow loading assets from a file path. The current workaround is using `Mozilla Firefox`.

To summarize running the server: 
* Run the local server with the aforementioned commands
* Open `index.html` with its relative path instead of on the local server 
* Use `Mozilla Firefox` or another browser which allows loading assets from a file path

If everything works well, a cursor ('X') should appear on screen.

#### Controls
* Joystick to move the laser and on screen cursor
* Joystick click on a word to grab and release it (to change its position)
* Green button to add a random word
* Red button to delete the word that is currently being grabbed by the cursor

#### Calibration
Before we're ready to roll, the controller should be calibrated to the dimensions of the surface or screen where Word Jam is being played. Calibration is simple and has the following steps:

1. Move the laser/cursor to the top left of the canvas
2. Press the `s` key on the keyboard
3. Move the laser/cursor to the bottom right of the canvas
4. Press the `e` key on the keyboard

And now, everything's all set to start Word Jamming!

### Without the Arduino Controller

To begin, change the Arduino enabled flag, `IS_USING_ARDUINO_CONTROLLER`, in `sketch.js` to `false` and open `index.html` either in a browser that supports loading assets from a file path, such as `Mozilla Firefox`, or run a local server and open `index.html` on the server side using any browser (see the above instructions which have details on running the server).

#### Controls
* Mouse to move
* Mouse click on a word to grab and release it (to change its position)
* (P)ush a new random word
* (R)emove the word that is currently being grabbed by the cursor
