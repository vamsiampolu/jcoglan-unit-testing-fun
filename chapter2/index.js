JS.Test.describe('Hello World!',function(){
  with(this) {
      it("runs a test",function(){
        with(this) {
          assertEqual("Hello World",["Hello","World"].join(" "))
        }
      })
  }
})

JS.Test.describe('DOM fixtures',function(){
  this.before(function(){
    this.fixture = $('#fixture')
    this.fixture.append($('<p class="message">Hello</p>'))
  })

  this.after(function(){
      this.fixture.empty()
  })

  this.it('creates a paragraph saying Hello',function(){
      this.assertEqual('Hello',this.fixture.find('p').text())
  })

  this.it('creates a paragraph with the class `message`',function(){
      this.assert(this.fixture.find('p').hasClass('message'))
  })

  this.it('creates exactly one paragraph',function(){
    this.assertEqual(1,this.fixture.find('p').length)
  })
})


var hijackLink = function(selector, target) {
    $(selector).on("click", function() {
      var url = $(this).attr("href")
      $.get(url, function(response) {
        $(target).html(response)
      })
      return false
    })
  }

/*JS.Test.describe('Faking $.get manually',function(){

  this.before(function(){
      this.fixture = $('#fixture')
      this.fixture.html('<p></p><a href="/">Home</a>')
      this.jqueryGet = $.get
      $.get = function(url,cb) {
        callback('Hello From the server')
      }

      hijackLink('#fixture a','#fixture p')
  })

  this.after(function(){
    this.fixture.empty()
    $.get = this.jqueryGet
  })

  this.describe('when the link is clicked',function(){
      this.before(function(resume){
        syn.click(this.fixture.find('a'),resume)
      })
      this.it('displays the server response',function(){
          this.assertEqual('Hello From the server', this.fixture.find('p').text())
      })
  })
})
*/

JS.Test.describe('Automated stubbing',function(){
  this.before(function(){
    this.fixture = $('#fixture')
    this.fixture.html('<p></p>\n<a href="/">Home</a>')
    this.stub($,'get').yields(['Hello from the server'])
    hijackLink("#fixture a", "#fixture p")
  })

  this.after(function(){
    this.fixture.empty()
  })

  this.describe('when the link is clicked',function(){
    this.before(function(resume){
      syn.click(this.fixture.find('a'),resume)
    })

    this.it('displays the server response',function(){
        this.assertEqual( "Hello from the server", this.fixture.find("p").text())
    })
  })
})

var debug = function(message) {
  console.info(new Date().getTime() + ' ' + message)
}

JS.Test.describe('debug() with mocks',function(){
  this.it('writes data to the console with timestamps',function(){
    this.expect(console,'info').given((this.match(/^[0-9]{13} hello$/)))
    debug('hello')
  })
})

JS.Test.describe('debug() with spies',function(){
  this.before(function(){
    sinon.spy(console,'info')
  })
  this.it('writes data to the console with timestamps',function(){
    debug('Hello')
    sinon.assert.calledWithMatch(console.info, /^[0-9]{13} hello$/)
  })
  this.after(function(){
      console.info.restore()
  })
})

JS.Test.autorun()
