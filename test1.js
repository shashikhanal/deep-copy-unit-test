// we used
// mocha 2.2.5
// chai 3.30
let mocha = require('mocha');
let chai = require('chai');

const locations = ['HK', 'SG', 'UK', 'NZ', 'AU'];

const employeeDefaults = {
  name: 'undefined',
  reserved: undefined,
  info: {
    address: 'Nepal',
    level: 1,
    age: {
      DOB: 'YYY-MMM-DDD',
      today: new Date(1534235210553)
    }
  }
};

function Company() {
  Object.assign(this, employeeDefaults);
  this.company = 'Zegal';
  this.info.locations = locations;
}

Company.prototype.speakLocation = function(location) {
  const locations = {
    HK: 'Hong Kong',
    SG: 'Singapore',
    UK: 'England and Wales',
    NZ: 'New Zealand',
    AU: 'Australia'
  };

  return locations[location] || 'Hong Kong';
};

Company.prototype.getLocations = function() {
  let locations = [];

  if (this.info.locations) {
    this.info.locations.forEach(location => {
      locations.push(this.speakLocation(location));
    });
  }

  return locations;
};

const object1 = new Company();

const object2 = {
  name: 'Zegal Dev channel',
  info: {
    locations: ['NP', 'SG'],
    devs: 20,
    active: true
  },
  created: new Date(),
  updated: new Date()
};

const copyObject = obj => {
  // ============================================================
  // ============================================================
  // ONLY MAKE YOUR CHANGES HERE!!
  // ============================================================
  // ============================================================
  function clone(item) {
      if (!item) { return item; }

      var types = [ Number, String, Boolean ],
          result;

      // normalizing primitives if someone did new String('aaa'), or new Number('444');
      types.forEach(function(type) {
          if (item instanceof type) {
              result = type( item );
          }
      });

      if (typeof result == "undefined") {
          if (Object.prototype.toString.call( item ) === "[object Array]") {
              result = [];
              item.forEach(function(child, index, array) {
                  result[index] = clone( child );
              });
          } else if (typeof item == "object") {
              // testing that this is DOM
              if (item.nodeType && typeof item.cloneNode == "function") {
                  result = item.cloneNode( true );
              } else if (!item.prototype) {
                  if (item instanceof Date) {
                      result = new Date(item);
                  } else {
                      result = {};
                      for (var i in item) {
                          result[i] = clone( item[i] );
                      }
                  }
              } else {
                  if (false && item.constructor) {
                      result = new item.constructor();
                  } else {
                      result = item;
                  }
              }
          } else {
              result = item;
          }
      }

      return result;
  }

  let newObject = clone(obj);

  return newObject;
};

// mocha.setup('bdd');
let expect = chai.expect;

describe('Object 1 General test', function() {
  const myobject = copyObject(object1);

  it('should make a new copy of the object', function() {
    expect(object1 !== myobject).to.equal(true);
    expect(myobject).to.be.not.equal(object1);
  });

  it('should have same field values', function() {
    expect(object1).to.deep.equal(myobject);
  });

  it('should copy array correctly', function() {
    expect(myobject.info.locations).to.be.an('array');
  });

  it('should copy prototype function', function() {
    expect(myobject.getLocations()).to.be.an('array');
    expect(myobject.speakLocation('HK')).to.be.equal('Hong Kong');
  });
});

describe('Object 1 Mutation test', function() {
  const myObject = copyObject(object1);

  it('shouldn\'t have same reference at 1st level', function() {
    myObject.company = 'Dragonlaw';
    myObject.name = 'defined';
    myObject.reserved = null;
    expect(object1.company).to.not.equal(myObject.company);
    expect(object1.name).to.not.equal(myObject.name);
    expect(object1.reserved).to.not.equal(myObject.reserved);

    expect(myObject.info.address).to.equal('Nepal');
  });

  it('shouldn\'t have same reference at deeper level', function() {
    myObject.info.address = 'Hong Kong';
    myObject.info.level = 2;
    myObject.info.age = null;

    expect(object1.info.address).to.not.equal(myObject.info.address);
    expect(object1.info.level).to.not.equal(myObject.info.level);
    expect(object1.info.age).to.not.equal(myObject.info.age);
  });
});

describe('Object 2', function() {
  const myObject = copyObject(object2);

  it('should make a new copy of the object', function() {
    expect(object2 !== myObject).to.equal(true);

    expect(myObject.info.locations[0]).to.equal('NP');
  });

  it('should have same field values', function() {
    expect(object2).to.deep.equal(myObject);
  });

  it('should copy array correctly', function() {
    expect(myObject.info.locations).to.be.an('array');
  });
});

describe('Object 2 Mutation test', function() {
  const myObject = copyObject(object2);

  it('shouldn\'t have same reference at 1st level', function() {
    myObject.name = 'Dev channel';
    myObject.created = { test: true };
    myObject.updated = [];
    expect(object2.name).to.not.equal(myObject.name);
    expect(object2.created).to.not.equal(myObject.created);
    expect(object2.updated).to.not.equal(myObject.updated);
  });

  it('shouldn\'t have same reference at deeper level', function() {
    myObject.info.locations = {};
    myObject.info.devs = 22;
    myObject.info.active = false;
    expect(object2.info.locations).to.not.equal(myObject.info.locations);
    expect(object2.info.devs).to.not.equal(myObject.info.devs);
    expect(object2.info.active).to.not.equal(myObject.info.active);
  });
});

// mocha.checkLeaks();
// mocha.globals(['jQuery']);
// mocha.run();
