# Debunking NPM Packages

I have found so mnay obstacles while trying to publish my first npm package that I see myself forced to thoroughly document the errors and their potential solution so that the errors are not repeated down the road. 

## Case #0: Exporting an empty file (passes)
**npm code, index.js:**
```javascript
// empty file
```

**RunKit response (Node JS environment):**
```javascript
var debunkingNpmPackages = require("debunking-npm-packages" 1.0.0)

// response:
Object {}
    |--Object Prototype
        |-- constructor: function()
        |-- __defineGetter__: function()
        |--__defineSetter__: function()
        |--hasOwnProperty: function()
        |--__lookupGetter__: function()
        |--__lookupSetter__: function()
        |--isPrototypeOf: function()
        |--propertyIsEnumerable: function()
        |--toString: function()
        |--valueOf: function()
        |--__proto__ (getter): function()
        |--__proto__ (setter): function()
        |--toLocaleString: function()
```

**Consumer apps response:**
```javascript
import debunkingNpmPackages from 'debunking-npm-packages'

console.log(debunkingNpmPackages);

// repsonse (React, react-scripts 5.0.1):
{}

// repsonse (React, react-scripts 4.0.3):
{}
```

**Explanation:**
In Node JS, `module` is an object, with the following structure:
```javascript
console.log(module)

// output
Module {
  id: '/Users/username/debunking-npm-packages/index.js',
  path: '/Users/username/debunking-npm-packages',
  exports: {},
  filename: '/Users/username/debunking-npm-packages/index.js',
  loaded: false,
  children: [],
  paths: [
    '/Users/username/debunking-npm-packages/node_modules',
    '/Users/username/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
```

The `exports` property of this module object is an empty object (by default), that is,
```javascript
module.exports  // =>  {}
```
Exporting a file exports the `exports` property of the module object. Hence, exporting an empty file exports an empty object. 


## Case #1: Mixed exports (passing)

**Node, index.js:**
```javascript
// Case #1: Mixed exports (passing)
const string = "my string"

const myFunction = function(){
    return "This is my function"
}
const array = [1,2,3,4,5,6,7]

const myObject = {
    day: "Monday",
    month: "July"
}

// Mixed exports
exports.additional = "Additional";
module.exports.again = "Again";

module.exports = {
    string,
    myFunction,
    array,
    myObject
}

module.exports.addMe = "Add me too!!!";
exports.moreStuff = "More stuff";
module.exports.canIGo = "Can I go?";
```

**Node response, consumer.js:**
```javascript
const everyting = require('./index');
console.log(everyting);
// Log:
{
  string: 'my string',
  myFunction: [Function: myFunction],
  array: [
    1, 2, 3, 4,
    5, 6, 7
  ],
  myObject: { day: 'Monday', month: 'July' },
  addMe: 'Add me too!!!',
  canIGo: 'Can I go?'
}
```
Consumer app response (React, react-scripts 5.0.1):
```javascript
{
    addMe: "Add me too!!!"
    array: (7) [1, 2, 3, 4, 5, 6, 7]
    canIGo: "Can I go?"
    myFunction: ƒ ()
    myObject: {day: 'Monday', month: 'July'}
    string: "my string"
}
```
**Explanation:**
Out of the 6 exports, only 3 exports were exported, namely:
`module.exports = `, and the two `module.exports.something` located below the `module.exports =`.

Rules: 
* If present, `module.exports =` always get exported (the default export).
* If there is a `module.exports =`, the `module.exports.something` get exported ONLY IF they are located below the `module.exports =`.
* If there is a `module.exports =`, the `exports.something` DON'T GET EXPORTED (regardless of their location).

Let us now remove the `module.exports =` to see what happens:
```javascript
// index.js
exports.additional = "Additional";
module.exports.again = "Again";
module.exports.addMe = "Add me too!!!";
exports.moreStuff = "More stuff";
module.exports.canIGo = "Can I go?";

// Response, consumer.js:
const everyting = require('./index');
console.log(everyting);
// Log:
{
  additional: 'Additional',
  again: 'Again',
  addMe: 'Add me too!!!',
  moreStuff: 'More stuff',
  canIGo: 'Can I go?'
}
```

Rule:
If there is not a `module.esports =`, then both `module.exports.something` and `exports.somethig` get always exported.


## Case #2: Requiring modules (passing)
**Node, index.js:**
```javascript
const info = "my info";
const calendar = {
    day: "Monday",
    month: "July"
};

module.exports = "We are two 'module.exports=', do I get exported?";
module.exports = {
    info,
    calendar
};
```

**Node response, consumer.js:**
```javascript
const everyting = require('./index');
const { info, calendar, pencil } = require('./index');
console.log(everyting);
console.log(info);
console.log(calendar);
console.log(pencil);

// Logs:
{ info: 'my info', calendar: { day: 'Monday', month: 'July' } }
my info
{ day: 'Monday', month: 'July' }
undefined
```

**Explanation:**
First, let us notice that we have two `module.exports =`. We derive the following rule

Rule:
* If there are multiple `module.exports =`, only the LAST ONE gets exported.

The left-handside of the second `require` utilizes JavaScript's destructuring assignment to pull in the VALUES from the called referenced properties.  Since `pencil` WAS NOT a property on the exported object, it is `undefined`.


## Case #3: Requiring modules (failing)

**Node, index.js:**
```javascript
const sum = (num) => num + num;
exports.sum = sum;
```

**Node response, consumer.js:**
```javascript
const everyting = require("./index4")
console.log(everyting)

// Throws error:
Error: Cannot find module './index4'
code: 'MODULE_NOT_FOUND',
requireStack: [ '/Users/username/debunking-npm-packages/consumer.js' ]
```

**Explanation:**
The file `index4.js` is not present at the specified directory, and Node throws an error. Now, if we create a folder called `node_modules` and place it in the root directory (next to package.json), and inlucde an empty file within it called `index4.js`, and change the `require` statement in consumer.js from `require("./index4)` to `require("index4")`, we get the following response:
```javascript
// consumer.js
console.log(everything) // => {}
```
that is, Node searched for an `index4.js` file relative to the directory `node_modules` and, since it found it, it returned our console.log.
