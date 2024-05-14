"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomResultGenerator = exports.sendInitdata = void 0;
var App_1 = require("./App");
var BonusResults_1 = require("./BonusResults");
var Global_1 = require("./Global");
var testData_1 = require("./testData");
var utils_1 = require("./utils");
function sendInitdata(clientID) {
    console.log("intiation");
    (0, Global_1.makePayLines)();
    var matrix = (0, utils_1.generateMatrix)(Global_1.gameSettings.matrix.x, 18);
    var bonus = new BonusResults_1.bonusGame(8, 1000);
    for (var i = 0; i < 3; i++) {
        var strng = "Player has the right to start the slot machine without using their funds for a certain number of times. The size of the bet is determined by the";
        Global_1.UiInitData.spclSymbolTxt.push(strng);
    }
    var dataToSend = {
        "GameData": {
            "Reel": matrix,
            "Lines": testData_1.linesApiData,
            "Bets": [1, 5, 10, 15, 20],
            "canSwitchLines": false,
            "LinesCount": [1, 5, 10, 15, 20],
            "autoSpin": [1, 5, 10, 20],
        },
        "BonusData": bonus.generateData(),
        "UIData": Global_1.UiInitData,
        "PlayerData": Global_1.playerData,
    };
    (0, App_1.sendMessageToClient)(clientID, "InitData", dataToSend);
}
exports.sendInitdata = sendInitdata;
var RandomResultGenerator = /** @class */ (function () {
    function RandomResultGenerator() {
        // Generating a 3x5 matrix of random numbers based on weights
        var matrix = [];
        for (var i = 0; i < Global_1.gameSettings.matrix.y; i++) {
            var row = [];
            for (var j = 0; j < Global_1.gameSettings.matrix.x; j++) {
                var randomIndex = this.randomWeightedIndex(Global_1.gameSettings.Weights);
                row.push(Global_1.gameSettings.Symbols[randomIndex]);
            }
            matrix.push(row);
        }
        Global_1.gameSettings.resultSymbolMatrix = matrix;
    }
    // Function to generate a random number based on weights
    RandomResultGenerator.prototype.randomWeightedIndex = function (weights) {
        var totalWeight = weights.reduce(function (acc, val) { return acc + val; }, 0);
        var randomNumber = Math.random() * totalWeight;
        var weightSum = 0;
        for (var i = 0; i < weights.length; i++) {
            weightSum += weights[i];
            if (randomNumber <= weightSum) {
                return i;
            }
        }
        // Default to last index if not found
        return weights.length - 1;
    };
    return RandomResultGenerator;
}());
exports.RandomResultGenerator = RandomResultGenerator;
