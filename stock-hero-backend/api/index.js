const app = require('../server');

// Vercel Serverless Entrypoint
module.exports = (req, res) => {
    app(req, res);
};
