const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://136.244.41.17/32/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose.connection;
