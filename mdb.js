//
//  mongodb methods
//

const
      COLL = "csv_data",
      {MongoClient} = require('mongodb')

// global db connection
var db;
var x = module.exports = {};

x.init = (url, cb) => {
  MongoClient.connect(url, (err, dbc) => {
    if(err) {
      console.warn("dberr:", err);
      return;
    }
    db = dbc;
    cb();
  })
}

x.fetch = (q, cb) => {
  db.collection(COLL).find(q).limit(1000).toArray( (err, data) => {
    if(err) {
      console.warn("find:", err);
    };
    cb(data);
  });
}

x.insert = (row, cb) => {
  db.collection(COLL).insertOne(row, (err, res) => {
    if(err) {
      console.warn("insert:", err);
    };
    cb();
  });
}

x.remove = (q, cb) => {
  db.collection(COLL).deleteMany(q, (err, res) => {
    if(err) {
      console.warn("remove:", err);
    };
    cb();
  });
}

//.
