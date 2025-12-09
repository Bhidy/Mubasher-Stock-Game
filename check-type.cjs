const pkg = require('yahoo-finance2');
const def = pkg.default;
console.log('Type of default:', typeof def);
console.log('Is constructor?', !!def.prototype && !!def.prototype.constructor.name);
try {
    const instance = new def();
    console.log('Instantiation success!');
} catch (e) {
    console.log('Instantiation failed:', e.message);
}
