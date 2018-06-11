"use strict";
exports.__esModule = true;
var faker = require("faker");
var _ = require("lodash");
var natural = require("natural");
var trainingData = require("./trainer.json");
var Fake = /** @class */ (function () {
    function Fake() {
        var _this = this;
        this.classifier = new natural.BayesClassifier();
        trainingData.forEach(function (item) {
            _this.classifier.addDocument(item.text, item.label);
        });
        this.classifier.train();
    }
    Fake.prototype.getValue = function (key, options) {
        var cleanKey = _.startCase(_.toLower(key));
        var fakerKey = this.classifier.classify(cleanKey);
        if (fakerKey == 'date') {
            return (new Date()).toISOString();
        }
        else {
            return faker.fake("{{" + fakerKey + "}}");
        }
    };
    Fake.prototype.getDocument = function (schema) {
        let json = {};
        for (var key in schema) {
            if (typeof schema[key] == 'object') {
                if (Array.isArray(schema[key])) {
                    if (typeof schema[key][0] == 'object') {
                        var _temp = [];
                        _temp.push(this.getDocument(schema[key][0]));
                        var len = Math.floor(Math.random() * 100) % 6;
                        for (var i = 0; i < len; i++) {
                            _temp.push(this.getDocument(schema[key][0]));
                        }
                        json[key] = _temp;
                    } else {
                        var _temp = [];
                        _temp.push(this.getValue(key))
                        var len = Math.floor(Math.random() * 100) % 6;
                        for (var i = 0; i < len; i++) {
                            _temp.push(this.getValue(key));
                        }
                        json[key] = _temp;
                    }
                } else {
                    json[key] = this.getDocument(schema[key]);
                }
            } else {
                json[key] = this.getValue(key);
            }
        }
        return json;
    };
    return Fake;
}());
exports.Fake = Fake;
