const express = require('express');
const router = express.Router();

router.use((req, res) => {
  res.sendStatus(404);
});

module.exports = router;
