;(function (root, factory) {
	if (typeof exports == "object") {
		// CommonJS
		module.exports = exports = factory(require("./test2"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["test2"], factory);
	}
	else {
		// Global (browser)
		factory("I'm a module injected to the browser's global namespace");
	}
}(this, function factory(argument) {

	// return CryptoJS.enc.Utf8;
	console.log(argument)

}));