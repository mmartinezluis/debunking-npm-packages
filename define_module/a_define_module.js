define(function(require, exports, module) {
    //Put traditional CommonJS module content here
});

define(function(require, exports, module) {
        var a = require('a'),
            b = require('b');

        //Return the module value
        return function () {};
    }
);

define(function (require) {
    var foo = require('foo');

    //Define this module as exporting a function
    return function () {
        foo.doSomething();
    };
});

// Instead of using require() to get dependencies inside the function passed to define(), 
// you can also specify them via a dependency array argument to define(). 
// The order of the names in the dependency array match the order of arguments passed 
// to the definition function passed to define(). So the above example that uses 
// the module foo:

define(['foo'], function (foo) {
    return function () {
        foo.doSomething();
    };
});