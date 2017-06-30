var URLSafeBase64 = require('urlsafe-base64');

let now = new Date()

const kv = {
  init: 'gg',
}
// base64('init') = aW5pdA


function getKEY(req, res) {
  var key = req.swagger.params.KvKey.value
  if(URLSafeBase64.validate(key)){
    key = URLSafeBase64.decode(key);
    if(kv.hasOwnProperty(key)){
      res.json(200, {
        VALUE: kv[key],
        TS: now,
      })
    }
    else {
      res.json(404, {
        message: 'key not found'
      })
    }
  }
  else {
    res.json(400, {
      message: 'key is not URL-safe Base64 encoded'
    })
  }
}

function deleteKEY(req, res) {
  var key = req.swagger.params.KvKey.value

  if(URLSafeBase64.validate(key)) {
    key = URLSafeBase64.decode(key)
    if(kv.hasOwnProperty(key)){
      var value = kv[key]
      delete kv[key]
      res.json(200, {
        "OLD_VALUE": value,
        TS: now,
      })
    }
  }
  else {
    res.json(400, {
      message: 'key is not URL-safe Base64 encoded'
    })
  }
}

function postKEY(req, res) {
  // url-safe base64
  var key = req.swagger.params.KvKey.value

  if(URLSafeBase64.validate(key)) {
    key = URLSafeBase64.decode(key)
    // base64
    var value = req.swagger.params.body.value.VALUE
    value = Buffer.from(value, 'base64').toString('ascii')
    kv[key] = value
    res.json(200, {
      TS: now,
    })
  }
  else {
    res.json(400, {
      message: 'key is not URL-safe Base64 encoded'
    })
  }
}

module.exports = {
  getKEY,
  deleteKEY,
  postKEY,
}
