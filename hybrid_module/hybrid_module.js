;(function (root, factory) {
	if (typeof exports == "object") {
		// CommonJS
		module.exports = exports = factory("I am a Node Js module inside a file that renders different module types depending on the current execution context.");
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.browserModuleFromHybrid = "I'm a global browser module inside a file that renders different module types depending on the current execution context. 'RequireJs' needs to be turned off for me to load. ";
        console.log(root.browserModuleFromHybrid)
	}
}(this, function factory(argument) {

	// console.log(argument)
    return argument;

}));