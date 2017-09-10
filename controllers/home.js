const mongoose = require('mongoose');

module.exports = {
  index: (req, res) => {
          res.render('home/index');
  }
};