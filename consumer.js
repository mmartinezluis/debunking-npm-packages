// Case #2: Requiring modules (passing)
const everyting = require('./index');
const { info, calendar, pencil } = require('./index');
console.log(everyting);
console.log(info);
console.log(calendar);
console.log(pencil);



// ********************************************* //

// Case #1: Mixed exports (passing)

// const everyting = require('./index');
// console.log(everyting);



// ********************************************* //

// Case #0: Importing an empty file (passes)

// console.log(require('./index')) // => {}

