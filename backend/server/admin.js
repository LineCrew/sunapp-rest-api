import * as express from 'express';
import path from 'path';
let router = express.Router();

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
  });

module.exports = router;
