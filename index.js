// Case #7: Serving different module types

let CryptoJS = {
    enc: {
        Utf8: "utf-8 enconding"
    }
}
;(function (root, factory) {
    console.log(define)
	if (typeof exports !== "object") {
		// CommonJS
		module.exports = exports = factory(require("./commonjs_module/a_node_module"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./commonjs_module/a_node_module"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	// return CryptoJS.enc.Utf8;
	return "TESTING"

}));



// ********************************************* //

// Case #4: Requiring/Exporting modules mixed (failing + passing)

// const square = (n) => n * n;

// module.exports = square;



// ********************************************* //

// Case #3: Requiring modules (failing)
// const sum = (num) => num + num;
// exports.sum = sum;



// ********************************************* //

// Case #2: Requiring modules (passing) 

// const info = "my info";
// const calendar = {
//     day: "Monday",
//     month: "July"
// };

// module.exports = "We are two 'module.exports=', do I get exported?";
// module.exports = {
//     info,
//     calendar
// };


// ********************************************* //

// Case #1: Mixed exports (passing)

// const string = "my string";
// const myFunction = function(){
//     return "This is my function"
// };
// const array = [1,2,3,4,5,6,7];
// const myObject = {
//     day: "Monday",
//     month: "July"
// };

// // Mixed exports
// exports.additional = "Additional";
// module.exports.again = "Again";
// module.exports = {
//     string,
//     myFunction,
//     array,
//     myObject
// };
// module.exports.addMe = "Add me too!!!";
// exports.moreStuff = "More stuff";
// module.exports.canIGo = "Can I go?";


// ********************************************* //

// Case #0: Exporting an empty file (passes)