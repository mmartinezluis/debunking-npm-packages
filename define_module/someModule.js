;(function (root, factory) {
	if (typeof exports !== "object") {
		// CommonJS
		module.exports = exports = factory(require("../commonjs_module/a_node_module"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["../commonjs_module/a_node_module"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function factory(CryptoJS) {

	// return CryptoJS.enc.Utf8;
	return "TESTING"

}));