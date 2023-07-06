"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;
var networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
var carCtx = carCanvas.getContext("2d");
var networkCtx = networkCanvas.getContext("2d");
var road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
var N = 100;
var cars = generateCars(N);
var bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (var i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}

var traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2), new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2), new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 2)];
animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  var cars = [];

  for (var _i = 1; _i <= N; _i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }

  return cars;
}

function animate(time) {
  for (var _i2 = 0; _i2 < traffic.length; _i2++) {
    traffic[_i2].update(road.borders, []);
  }

  for (var _i3 = 0; _i3 < cars.length; _i3++) {
    cars[_i3].update(road.borders, traffic);
  }

  var bestCar = cars.find(function (c) {
    return c.y == Math.min.apply(Math, _toConsumableArray(cars.map(function (c) {
      return c.y;
    })));
  });
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);

  for (var _i4 = 0; _i4 < traffic.length; _i4++) {
    traffic[_i4].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;

  for (var _i5 = 0; _i5 < cars.length; _i5++) {
    cars[_i5].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);
  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50; //Visualizer.drawNetwork(networkCtx,bestCar.brain);

  requestAnimationFrame(animate);
}