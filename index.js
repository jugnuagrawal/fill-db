const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;
const http = require('http');
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

function _parseSchema(schema) {
    var json = {};
    for (var key in schema) {
        if (typeof schema[key] == 'object') {
            if (Array.isArray(schema[key])) {
                var _temp = [_parseSchema(schema[key][0])];
                var len = Math.floor(Math.random() * 100) % 6;
                for (var i = 0; i < len; i++) {
                    _temp.push(_parseSchema(schema[key][0]));
                }
                json[key] = _temp;
            } else {
                json[key] = _parseSchema(schema[key]);
            }
        } else {
            _patchValue(json, key, schema[key]);
        }
    }
    return json;
}


function _db(options) {
    var url = options.url ? options.url : 'mongodb://localhost:27017/';
    var count = options.count && options.count > 0 ? options.count : 10;
    var data = [];
    for (var i = 0; i < count; i++) {
        var temp = _parseSchema(options.schema);
        // temp._id = faker.random.uuid();
        data.push(temp);
    }
    MongoClient.connect(url, function (err, con) {
        if (err) throw err;
        console.log("Database found!");
        var db = con.db(options.database);
        db.collection(options.collection).insertMany(data, function (err, res) {
            if (err) throw err;
            console.log(res.insertedCount + " document inserted");
            con.close();
        });
    });
}
// _fill({
//     url: 'mongodb://localhost:27017/',
//     database: 'userDetails',
//     collection: 'users',
//     schema: {
//         "name": "String",
//         "email": "String",
//         "password": "String",
//         "contact": 9538005852,
//         "address": [
//             {
//                 "streetOne": "String",
//                 "streetTwo": "String",
//                 "city": "String",
//                 "state": "String",
//                 "pincode": 560100
//             }
//         ]
//     }
// });

// _api({
//     host: 'localhost',
//     port: 3000,
//     path: '/user',
//     schema: {
//         "name": "String",
//         "email": "String",
//         "password": "String",
//         "contact": 9538005852,
//         "address": [
//             {
//                 "streetOne": "String",
//                 "streetTwo": "String",
//                 "city": "String",
//                 "state": "String",
//                 "pincode": 560100
//             }
//         ]
//     }
// })

function _api(options) {
    var count = options.count && options.count > 0 ? options.count : 10;
    for (var i = 0; i < count; i++) {
        var req = http.request({
            host: options.host || 'localhost',
            port: options.port || 3000,
            path: options.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (res) {
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                console.log('');
            });
        });
        var temp = _parseSchema(options.schema);
        req.end(JSON.stringify(temp), 'utf-8');
    }
}

module.exports = {
    db: _db,
    api:_api
}