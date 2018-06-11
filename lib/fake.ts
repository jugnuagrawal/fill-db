import * as faker from 'faker';
import * as _ from 'lodash';
import * as natural from 'natural';
import trainer from './trainer.json';

export class Fake {
    private classifier: natural.BayesClassifier;
    constructor() {
        var trainingData: Array<TrainingData> = trainer;
        this.classifier = new natural.BayesClassifier();
        trainingData.forEach((item: TrainingData) => {
            this.classifier.addDocument(item.text, item.label);
        });
        this.classifier.train();
    }

    getValue(key: string, options?: any) {
        var cleanKey = _.startCase(_.toLower(key));
        var fakerKey = this.classifier.classify(cleanKey);
        if (fakerKey == 'date') {
            return (new Date()).toISOString();
        } else {
            return faker.fake("{{" + fakerKey + "}}");
        }
    }

    getDocument(schema: any) {
        let json: any = {};
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
    }
}

interface TrainingData {
    text: string;
    label: string;
}