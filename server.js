const express = require('express');

const postsRouter = require('./Posts/posts-router');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda</h>
  `);
});

module.exports = server;