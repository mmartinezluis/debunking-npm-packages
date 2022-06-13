const executionContext = this;
const sentence = "I'm a browser module injected to the browser's global namespace";

this.browserModule = sentence;
// 'this' is the 'window' variable in the browser

