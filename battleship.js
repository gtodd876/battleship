// Takes care of displaying a message in left corner as well as a graphic on the game board after you take a guess
var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }

};

//The Model maintains the state of the gameboard
  var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
            { locations: ["0", "0", "0"], hits: ["", "", ""] },
            { locations: ["0", "0", "0"], hits: ["", "", ""] },
            { locations: ["0", "0", "0"], hits: ["", "", ""] }
    ],

    fire: function(guess) {
      for (var i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        var index = ship.locations.indexOf(guess);
        if (index >= 0) {
          ship.hits[index] = "hit";
          view.displayHit(guess);
          view.displayMessage("Hit!");

          if (this.isSunk(ship)) {
            view.displayMessage("You sank my battleship!");
            this.shipsSunk++;
          }
          return true;
        }
      }
      view.displayMiss(guess);
      view.displayMessage("You missed.");
      return false;
    },

    isSunk: function(ship) {
      for (var i = 0; i < this.shipLength; i++) {
        if (ship.hits[i] !== "hit") {
          return false;
        }
      }
      return true;
    },

    generateShipLocations: function() {
      var locations;
      for (var i = 0; i < this.numShips; i++) {
        do {
          locations = this.generateShip();
        } while (this.collision(locations));
        this.ships[i].locations = locations;
      }
      // console.log("Ships array: ");
      // console.log(this.ships);
    },

    generateShip: function() {
      var direction = Math.floor(Math.random() * 2);
      var row, col;

      if (direction === 1) {
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
      } else {
        col = Math.floor(Math.random() * this.boardSize);
        row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
      }

      var newShipLocations = [];
      for (var i = 0; i < this.shipLength; i++) {
        if (direction === 1) {
          newShipLocations.push(row + "" + (col + i));
        } else {
          newShipLocations.push((row + i) + "" + col);
        }
      }
      return newShipLocations;
    },

    collision: function(locations) {
      for (var i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        for (var j = 0; j < locations.length; j++) {
          if (ship.locations.indexOf(locations[j]) >= 0) {
            return true;
          }
        }
    }
    return false;
  }
  };
  //the controller passes to players guesses to the model as well as keep track if the game is over yet
    var controller = {
      guesses: 0,

      processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
          this.guesses++;
          var hit = model.fire(location);
          if (hit && model.shipsSunk === model.numShips) {
            view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
          }
        }
      }
    }
    //Convert the player's guess from something like "C3" to "33" ...A=0, B=1, C=3 and so on
    function parseGuess(guess) {
      var alphabet = ["A","B","C","D","E","F","G"];

      if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board");
      } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
          alert ("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
          alert("Oops, that's off the board!");
        } else {
          return row + column;
        }
      }
      return null;
    }

    function handleFireButton() {
      var guessInput = document.getElementById("guessInput");
      var guess = guessInput.value.toUpperCase();
      controller.processGuess(guess);
      guessInput.value = "";
      document.getElementById("guessInput").focus();
    }

    function handleKeyPress(e) {
      var fireButton = document.getElementById("fireButton");
      if (e.keyCode === 13) {
        fireButton.click();
        return false;
      }
    }

    //These next two function deal with capturing the string input from the player once they click the fire button
    window.onload = init;

    function init() {
      var fireButton = document.getElementById("fireButton");
      fireButton.onclick = handleFireButton;
      var guessInput = document.getElementById("guessInput");
      guessInput.onkeypress = handleKeyPress;

      model.generateShipLocations();
    }

  //   Testing parseGuess
  // console.log(parseGuess("A0"));
  // console.log(parseGuess("B6"));

  // Testing the Controller
  // controller.processGuess("A0");
  // controller.processGuess("A6");
  // controller.processGuess("B6");
  // controller.processGuess("C6");
  // controller.processGuess("C4");
  // controller.processGuess("D4");
  // controller.processGuess("E4");
  // controller.processGuess("B0");
  // controller.processGuess("B1");
  // controller.processGuess("B2");




  //Testing Model Object

  // model.fire("53");
  // model.fire("06");
  // model.fire("16");
  // model.fire("26");
  // Testing View Object

  // view.displayMiss("00");
  // view.displayHit("34");
  // view.displayMiss("55");
  // view.displayHit("12");
  // view.displayMiss("25");
  // view.displayHit("26");
  //
  // view.displayMessage(" Test");
