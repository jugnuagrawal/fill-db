# fill-db

For those who are tired of filling db with fake values just to check API

## How to use

```sh
npm install --save fill-db
```

### Fill database directly

```javascript
const filldb = require('fill-db');

var options = {
    url:'mongodb://localhost:27010/', //Optional, default: mongodb://localhost:27010/
    database:'sampleDatabase', //Required.
    collection:'user', //Required. 
    schema:{ //Required. the structure that needs to be filled
        name:"some name",
        email:"some email",
        contactNo:1234567890,
        password:"some text"
    },
    count:25 //Optional, default: 10
}

filldb.db(options)

```
### Fill database using API

```javascript
const filldb = require('fill-db');

var options = {
    host: 'localhost', //Optional, default: localhost
    port: 3000, //Optional, default: 3000
    path: '/user', //Required. if no path available provide '/'
    schema:{ //Required. the structure that needs to be filled
        name:"some name",
        email:"some email",
        contactNo:1234567890,
        password:"some text"
    },
    count:25 //Optional, default: 10
}

filldb.api(options)

```

## License
[MIT](https://github.com/jugnuagrawal/fill-db/blob/master/LICENSE)
