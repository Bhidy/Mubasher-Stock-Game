const pkg = require('yahoo-finance2');
console.log('Exports:', Object.keys(pkg));
console.log('Default keys:', Object.keys(pkg.default || {}));
