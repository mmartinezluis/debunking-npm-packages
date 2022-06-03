# Debunking NPM Packages

I have found so mnay obstacles while trying to publish my first npm package that I see myself forced to thoroughly document the errors and their potential solution so that the errors are not repeated down the road. 

## Case #0
npm code, index.js:
```javascript
// empty file
```

RunKit response:
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

Consumer apps response:
```javascript
import debunkingNpmPackages from 'debunking-npm-packages'

console.log(debunkingNpmPackages);

// repsonse (React, react-scripts 5.0.1)
{}

// repsonse (React, react-scripts 4.0.3)
{}
```






