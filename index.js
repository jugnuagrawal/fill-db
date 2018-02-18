const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;

function _patchValue(json, key, value) {
    if (typeof value == 'string') {
        if (key.match(/^.*(phone|contact|mobile|cell).*$/i)) {
            json[key] = faker.phone.phoneNumber((value+'').replace(/[0-9]/g,'#'));
        }else if (key.toLowerCase() == 'internet') {
            json[key] = faker.internet.userName();
        }else if (key.toLowerCase() == 'email') {
            json[key] = faker.internet.email();
        }else if (key.toLowerCase() == 'password') {
            json[key] = faker.internet.password();
        }else if (key.toLowerCase() == 'gender') {
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
                json[key] = [_parseSchema(schema[key])];
            } else {
                json[key] = _parseSchema(schema[key]);
            }
        } else {
            _patchValue(json, key, schema[key]);
        }
    }
    return json;
}


function _fill(options) {
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
        db.collection(options.collectionName).insertMany(data, function (err, res) {
            if (err) throw err;
            console.log(res.insertedCount + " document inserted");
            con.close();
        });
    });
}
_fill({
    url: 'mongodb://localhost:27017/',
    database: 'sampleService',
    collectionName: 'sampleService',
    schema: {
        "name": "Jugnu",
        "email": "Junu@agrawal.in",
        "password": "djsaljdladjm",
        "contactNo": 9538005852,
        "gender": "Male"
    }
});

module.exports = {
    fill:_fill
}