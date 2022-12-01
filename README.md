## My Contacts
 
- [Click to Play](https://moorebarrett-jodiann.github.io/keyboard-ninja/)
- [Description](#description)
- [Usage](#usage)
- [Requirements](#requirements)
- [Tests](#tests)
- [How to Play](#instructions)
- [Screenshots](#screenshots)
- [Issues](#issues)

## Description

Fun, interactive, speed typing game built using HTML, CSS, EcmaScript (ES) modules and [lite-server](https://www.npmjs.com/package/light-server)

## Usage

Set the **type** attribute on the HTML markup to **'module'**:

```html
<script src="...path/index.js" type="module"></script>
```

Initialize package.json file setup:

```sh
npm init -y
```

Install the **lite-server** package with [npm](https://www.npmjs.org/) and create a local dev environment:

```sh
npm install lite-server --save-dev
```

In the **package.json** file created, update the 'scripts' property by setting the **'dev'** environment to **lite-server**:

```json
{
  "name": "es-modules",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "lite-server",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "lite-server": "^2.6.1"
  }
}
```

## Requirements

Dependencies:
- [Node.js](https://nodejs.org/)

## Tests

To run the application in the browser:

- run `npm run dev` in the terminal in the root path of the repository package.

## Instructions

1. Press ```Start``` button to begin
2. In the white box type the word you see in the red box above it
3. If you spell the word correctly, a new word will be displayed
4. Get as many words typed before the timer runs out

## Screenshots

Here are a few screenshots from the game:

**Splash Screen**
![Splash Screen](./src/images/game-screenshots/splash-screen.png?raw=true "Game Splash Screen")

**Game in Progress**
![Game](./src/images/game-screenshots/game-in-progress-with-timer-countdown.png?raw=true "Game in Progress")

**Score Board**
![Game](./src/images/game-screenshots/scoreboard.png?raw=true "Scoreboard")

##### Find out if you're the next Keyboard Ninja ####
### 😄😄 HAVE FUN!! 😄😄 ###


###### Issues
If you are unable to play audio in the browser, refer to this  [resource](https://www.alphr.com/fixes-sound-not-working-chrome/) for a suggested fix.