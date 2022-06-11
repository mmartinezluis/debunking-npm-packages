# Debunking NPM Packages

I found so mnay obstacles while trying to publish my first npm package that I saw myself forced to thoroughly document the errors and their potential solution so that the errors are not repeated down the road. 

## Case #0: Exporting an empty file (passes)
**Node, index.js:**
```javascript
// empty file
```

**RunKit response (Node JS environment):**
```javascript
var debunkingNpmPackages = require("debunking-npm-packages" 1.0.0)

// response:
Object {}
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

**Explanation:**
Out of the 6 exports, only 3 exports were exported, namely:
`module.exports = `, and the two `module.exports.something` located below the `module.exports =`. We derive the following rules:
* If present, `module.exports =` always get exported.
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

From the above results, we derive the following rule:
* If there is not a `module.esports =`, then both `module.exports.something` and `exports.somethig` always get exported.


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
First, let us notice that we have two `module.exports =`. We derive the following rule:
* If there are multiple `module.exports =`, only the LAST ONE gets exported.

The left-handside of the second `require` utilizes JavaScript's destructuring assignment to pull in the VALUES from the called referenced object's properties.  Since `pencil` WAS NOT a property on the exported object, it is `undefined`.


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
```
Throws error:
```
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


## Case #4: Requiring/Exportting modules mixed (failing + passing)

**Node, index.js:**
```javascript
const square = (n) => n * n;
module.exports = square;
```

**Node response, consumer.js:**
```javascript
const someMath = require("./index");
import square from "./index";

console.log(someMath);
console.log(square);
```

Throws error:
```
(node:30179) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
/Users/username/debunking-npm-packages/consumer.js:3
import square from "./index";
^^^^^^

SyntaxError: Cannot use import statement outside a module
```

**Explanation:**
Since we are using the syntax `module.exports=`, `module.exports.something`, `exports.something` for exporting, and the syntax `require("file-location")`, we are using the **CommonJS module** syntax (aka, **CJS module**, default to Node JS). The syntax `import blank from "directory"` belongs to the **ECMAScript Module** syntax (aka, **ES module** or **ESM**). Because our `package.json` file does not contain the property `"type": "module"`, all `.js` files are treated as **CommonJS modules** (in our case, `index.js` and `consumer.js`) and, since we are using an import statement in consumer.js, namely, `import square from "./index";`, we get the error `Cannot use import statement outside a module` since we are using ES module syntax within a CommonJS module.

Let's implement the second suggestion given in the warning, that is, changing the file extension to `.mjs` (modular javascript, which supports `import ` statement). After doing so, and running `node consumer.mjs`, we get a new error:

```
file:///Users/username/debunking-npm-packages/consumer.mjs:2
const someMath = require("./index");

ReferenceError: require is not defined in ES module scope, you can use import instead
```

Now Node is no longer complaining about the `import` statement, but it is now complaining about the `require` statement. This means that `consumer.mjs` is running as an ES (ECMAScript) module and not as a CommonJS module (CJS module). Ok; let us remove the `require` statement (and the corresponding `console.log` that uses it); after running `node consumer.mjs`, we get:
```javascript
[Function: square]
```

Interesting; we are getting a response with no errors. Learnings:

* A consumer file with extension`.mjs` whose code is written with ESM syntax can successfully import modules from a file that uses CommonJS syntax (that is, uses `module.exports =` syntax and alike).

Let us now revert the code to the initial state and try out the first suggestion in the warning from the first error, that is, include `"type": "module"` in package.json:
```javascript
// package.json
{
 // some properties
  "main": "index.js",  
  "type": "module",
  "author": "Luis Martinez",
  // more properties
}
```

After running `node consumer.js` we get:
```
file:///Users/username/debunking-npm-packages/consumer.js:3
import square from "./index.js";

SyntaxError: The requested module './index.js' does not provide an export named 'default'
```
Ok; Node is complaining about the `index.js` file and not about `consumer.js`; well, this case can be tricky. Node is complaning about `index.js` because of a statement inluded in `consumer.js`, namely, the statement:

```
import square from "./index.js";
```

When adding the property `"type": "module"` to the package.sjon file, all `.js` files within the scope of that package.json are treated as ES modules (ECMAScript modules). This means that `index.js` and `consumer.js` are being treated as ES modules (and not as Common JS modules). The statement `import square from "./index.js"` is called a "default import" statement. Such a statement expects a correspnoding `export default statement` (in ES syntax), which has the following format:
```
export default <something>
```
where `something` can be a string, a function, an array, an object, etc. Hence, since `index.js` is using CJS syntax (Common JS syntax) for exporting, namely, 
```
module.exports = { square }
```
we need to change the syntax to ES syntax. Now, if we did not know anything about ES syntax, we would probably attempt adding a `default` somewhere to the previous code, since the error says `provide an export named 'default'`; so let's do that first:
```javascript
const square = (n) => n * n;

module.exports = {
    default: square
}
// and let's try another way as well
module.default = square
```
For the above two trials we still get the same error. So let us actually fix the error using the ES module default export syntax:
```javascript
const square = (n) => n * n;

export default square  
```
Running, again, `node consumer.js` yields the following response:
```
file:///Users/luismartinez/debunking-npm-packages/consumer.js:2
const someMath = require("./index.js");

ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and '/Users/username/debunking-npm-packages/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.

  at file:///Users/username/debunking-npm-packages/consumer.js:2:18
```

Ok, remember that the files are running as ES mdodules; so now that we are using the proper syntax for exporting in `index.js` for the corresponding import syntax in `consumer.js`, we are no longer getting an error for index.js; what we need to do next is removing the `require` statement from `consumer.js` along with the console log that uses it:
```javascript
consumer.js
import square from "./index.js";
console.log(square);
```

Running consumer.js again yields:
```javascript
[Function: square]
```
NO ERRORS. Evryting is running within the ES module scope.

Let us summarize the learnings from this section:

* If package.json does not include the property `"types": "module"`, all `.js` files within the scope of that package.json run as CJS modules (CommonJS modules; Native to Node Js). 

* Changing the file extension of a file from `.js` to `.mjs` makes THAT FILE ONLY run as a ES module (ECMAScript module (ESM); native to JavaScript). 

* An ESM consumer file with extension `.mjs` (that is, uses `import` statement) can successfully import modules from CommonJS files (from both, `.js` and `.cjs` files).

* A consumer file running as an ES module module CANNOT import nor export using CommonJS module syntax; importing with `const blank = **require()**` will throw:
```
ReferenceError: require is not defined in ES module scope, you can use import instead
```
, while exporting with  `module.exports =` or `module.exports.something =` or `exports.something =` will throw:
```
ReferenceError: exports is not defined in ES module scope.
```

* When package.json includes `"types": "module"`, all `.js` files within the scope of that package.json will run as ES modules. However, files ending in `.cjs` will run as CJS modules.

* The above statement means that for all `.js` files, ESM syntax must be used (cannot merge CommonJs syntax).


## Case #5: 'Could not find a declaration for file...' warning
(To be developed)
If you are building your own npm package, and you install it in your app for testing, you might find a warning message in the line that imports your package, namely, on thisline:
```javascript
import MyPackage from `'..`your-npm-package'
```
If you place your mouse right after `from` you might see that a message pops up:
```
Could not find a declaration file for module '<your-npm-pakcage>'. '/Users/username/your-app/node_modules/your-npm-package/src/index.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/you-npm-package` if it exists or add a new declaration (.d.ts) file containing `declare module 'your-npm-package';`ts(7016)
```


## Case #6: 'Referrence error: process is not defined'
(To be developed)
```
VM69:2 Uncaught ReferenceError: process is not defined
    at Object.4043 (<anonymous>:2:13168)
    at r (<anonymous>:2:306599)
    at Object.8048 (<anonymous>:2:9496)
    at r (<anonymous>:2:306599)
    at Object.8641 (<anonymous>:2:1379)
    at r (<anonymous>:2:306599)
    at <anonymous>:2:315627
    at <anonymous>:2:324225
    at <anonymous>:2:324229
    at HTMLIFrameElement.e.onload (ind
```

## Case #7: Serving CommonJs modules, RequireJS modules, AMD modules, and Browser modules
(In progress)