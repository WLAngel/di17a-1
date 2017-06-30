var https = require('https')

// https://nkiua09s52.execute-api.ap-northeast-1.amazonaws.com/dev/encrypt
const options = {
  hostname: 'nkiua09s52.execute-api.ap-northeast-1.amazonaws.com',
  port: 443,
  path: '/dev/encrypt',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

function encryptText(req, res) {
  var CT = req.headers['content-type']
  var plain = req.swagger.params.body.value.plaintext

  if(CT === 'application/json') {
    if(validHex(plain)){
      var length = Buffer.from(plain, 'hex').length
      if(length <= 16) {
        var httpsrequest = https.request(options, (response) => {
          response.on('data', (chunk) => {
            res.json(200, {
              ciphertext: JSON.parse(chunk.toString()).ciphertext
            })
          })
        })
        httpsrequest.write(JSON.stringify({
          plaintext: plain
        }))
        httpsrequest.end()
      } // check plaintext length
      else {
        res.json(413, {
          message: 'decoded plaintext length exceeds 16 bytes'
        })
      }
    } // check if plaintext is valid
    else {
      res.json(400, {
        message: 'plaintext is not valid hex encoded'
      })
    }
  } // check if content-type is valid
  else {
    res.json(400, {
      message: 'Content-Type should be application/json'
    })
  }
}

const hex = '0123456789abcdef'
function validHex(s) {
  if(s.length%2 != 0) {
    return false
  }
  return s.split('').filter(x => hex.indexOf(x.toLowerCase()) != -1).length == s.length
}

module.exports = {
  encryptText,
}
