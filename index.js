const faker = require('faker');
const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const ProgressBar = require('progress');

const fake = new (require('./lib/fake')).Fake();

function _patchValue(json, key, value) {
    if (typeof value == 'string') {
        if (key.match(/^.*(phone|contact|mobile|cell).*$/i)) {
            json[key] = faker.phone.phoneNumber((value + '').replace(/[0-9]/g, '#'));
        } else if (key.toLowerCase() == 'internet') {
            json[key] = faker.internet.userName();
        } else if (key.toLowerCase() == 'email') {
            json[key] = faker.internet.email();
        } else if (key.toLowerCase() == 'password') {
            json[key] = faker.internet.password();
        } else if (key.toLowerCase() == 'gender') {
            json[key] = faker.fake("{{random.word}}");
        } else if (key.match(/^.*company.*$/i)) {
            json[key] = faker.company.companyName();
        } else if (key.match(/^.*name$/i)) {
            json[key] = faker.name.findName();
        } else {
            json[key] = faker.fake("{{random.words}}");
        }
    }
    if (typeof value == 'number') {
        if (key.match(/^.*(phone|contact|mobile|cell).*$/i)) {
            json[key] = +faker.phone.phoneNumber('##########');
        } else {
            json[key] = +faker.random.number();
        }
    }
    if (typeof value == 'boolean') {
        json[key] = faker.random.boolean();
    }
}


function _db(options) {
    var total = options.count && options.count > 0 ? options.count : 10;
    var count = 0;
    var startTime = new Date();
    var endTime;
    var insert = new ProgressBar('Data inserted [:bar] :current/:total', { total: total });
    var url = options.url ? options.url : 'mongodb://localhost:27017/';
    MongoClient.connect(url, function (err, con) {
        if (err) throw err;
        console.log("Database connected!");
        var db = con.db(options.database);
        while (count < total) {
            count += 1000;
            var data = [];
            var tempCount = total > 1000 ? 1000 : total;
            for (var i = 0; i < tempCount; i++) {
                data.push(fake.getDocument(options.schema));
            }
            db.collection(options.collection).insertMany(data, (err, res) => {
                if (err) throw err;
                insert.tick(1000);
                insert.render();
                if (insert.complete) {
                    endTime = new Date();
                    console.log('Completed in', (endTime - startTime) + 'ms');
                    process.exit(1);
                }
            });
        }
    });
}

function _api(options) {
    var total = options.count && options.count > 0 ? options.count : 10;
    var count = 0;
    var startTime = new Date();
    var endTime;
    var insert = new ProgressBar('Data inserted [:bar] :current/:total', { total: total });
    const options = {
        hostname: options.host || 'localhost',
        port: options.port || 3000,
        path: options.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    insert.render();
    var intVal = setInterval(() => {
        for (var i = 0; i < 10; i++) {
            var data = fake.getDocument(options.schema);
            var req = http.request(options, (res) => {
                insert.tick();
                insert.render();
                if (insert.complete) {
                    endTime = new Date();
                    console.log('Completed in', (endTime - startTime) + 'ms');
                    process.exit(1);
                }
            });
            req.write(JSON.stringify(data), 'utf-8');
            req.end();
        }
        count += 10;
        if (count >= total) {
            clearInterval(intVal);
        }
    }, 2);
}

module.exports = {
    db: _db,
    api: _api
}