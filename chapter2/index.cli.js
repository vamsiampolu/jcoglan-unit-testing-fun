var JS = require('jstest')
var sinon = require('sinon')

JS.Test.describe('Hello Node',function(){
    with(this) {
      it('runs a test in Node',function(){
        with(this) {
          assertEqual('Hello Node',['Hello','Node'].join(' '))
        }
      })
    }
})

var personNamed = function personNamed(name) {
  return {
    equals: function(value) {
      return typeof value === 'object' && value.name === name
    },
    toString:function() {
      return 'Person named '+ name
    }
  }
}

//creating a custom matcher using `jstest`
JS.Test.describe('Person',function(){
  with(this) {
    it('has a name of Bond',function(){
      with(this) {
        assertEqual(personNamed('Bond'),{name:'Bond'})
      }
    })
  }
})

JS.Test.describe('assertThrow',function(){ with(this)
  it('ensures that an error occurs',function(){with(this)
      assertThrow(TypeError,() => 'spline'.reticulate())
  })
})

// do not use unless you use `assertThrow`
JS.Test.describe('assertNotThrown',function(){ with(this)
  it('ensures that an error does not occur',function(){
    with(this) {
      assertNothingThrown(function(){
        'spline'.toUpperCase()
      })
    }
  })
})

JS.Test.describe('Array',function(){with(this){
    it('has a length',function(){
      with(this) {
        assertEqual(0,[].length)
        assertEqual(3,[1,2,3].length)
      }
    })

    it('returns the value at an index',function(){
      with(this) {
        assertEqual(undefined,[][0])
        assertEqual('b',['a','b','c'][1])
      }
    })

    it('returns the index of a value',function(){
      this.assertEqual(-1,[].indexOf('thing'))
      this.assertEqual(2,["this","wooden","idea"].indexOf("idea"))
    })
  }
})

JS.Test.describe('Array',function(){
  this.before(function(){
    this.array = ['this','wooden','idea']
  })
  this.it('has a length',function(){
    this.assertEqual(0,[].length)
    this.assertEqual(3,[1,2,3].length)
  })

    this.it('returns the value at an index',function(){
      this.assertEqual(undefined,[][0])
      this.assertEqual('b',['a','b','c'][1])
    })

    this.it('returns the index of a value',function(){
      this.assertEqual(-1,[].indexOf('thing'))
      this.assertEqual(2,["this","wooden","idea"].indexOf("idea"))
    })
})

var debug = function(message) {
  console.info(new Date().getTime() + ' ' + message)
}

JS.Test.describe('debug() with spies',function(){
  this.before(function(){
    this.spy = sinon.spy(console,'info')
  })
  this.it('writes data to the console with timestamps',function(){
    debug('Hello')
    this.spy.calledWithMatch(/^[0-9]{13} hello$/)
  })
  this.after(function(){
      console.info.restore()
  })
})

var Counter = function(){
  this.count = 0
}

Counter.prototype.inc = function(n,cb){
  var self = this
  setTimeout(function(){
    self.count +=n
    cb()
  },10)
}

JS.Test.describe('Counter',function(){
  this.before(function(){
    this.counter = new Counter()
  })

  this.it('increments the count',function(resume){
    var self = this
    this.counter.inc(5,function(){
        resume(function(){
          self.assertEqual(5,self.counter.count)
        })
    })
  })
})

JS.Test.autorun()
