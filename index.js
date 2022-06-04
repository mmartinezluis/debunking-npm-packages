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


// ********************************************* //

// Case #0: Exporting an empty file (passes)