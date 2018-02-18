# fill-db

For those who are tired of filling db with fake values just to check API

## How to use

```sh
npm install --save fill-db
```
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

filldb.fill(options)

```

## License
[MIT](https://github.com/jugnuagrawal/fill-db/blob/master/LICENSE)
