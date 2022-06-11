// Case #7: Serving different module types

const someMath = require("./index");
import square from "./index";

define([
    'require',
    'dependency'
], function(require, factory) {
    'use strict';
});
console.log(this)



// ********************************************* //

// Case #4: Requiring/Exporting modules mixed (failing + passing)

console.log(someMath);
console.log(square);



// ********************************************* //

// Case #3: Requiring modules (failing)
// const everyting = require("index4")
// console.log(everyting)


// ********************************************* //

// Case #2: Requiring modules (passing)
// const everyting = require('./index');
// const { info, calendar, pencil } = require('./index');
// console.log(everyting);
// console.log(info);
// console.log(calendar);
// console.log(pencil);



// ********************************************* //

// Case #1: Mixed exports (passing)
// const everyting = require('./index');
// console.log(everyting);



// ********************************************* //

// Case #0: Importing an empty file (passes)
// console.log(require('./index')) // => {}

