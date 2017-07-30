
'use strict';

const
  assert = require('assert'),
  mdb = require('../mdb'),
  MDB_URL = 'mongodb://mdb:27017/repnup';



const
  test_record = {name:"name1", surname:"sur1", email:"eml1"}

beforeEach((done) => {
  mdb.init(MDB_URL, () => {
    console.log("mdb init");
    // TODO: cleanup db!
    done();
  });
});


describe('insert csv record', () => {
  it('should insert record with 3 fields', (done) => {
    mdb.insert(test_record, (err) => {
      assert.equal(err, undefined);
      done(err);
    })
  });
});

describe('find csv record', () => {
  it('there should be a record with name', (done) => {
    mdb.fetch({name:test_record.name}, (err, data) => {
      // console.log("data:", data);
      assert.equal(data[0].name, test_record.name);
      done(err);
    })
  });
});

//.
