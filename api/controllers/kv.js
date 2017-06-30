var URLSafeBase64 = require('urlsafe-base64');

const kv = {
  init: 'deadbeef',
}
// base64('init') = aW5pdA

function getKEY(req, res) {
  var key = req.swagger.params.KvKey.value
  if(URLSafeBase64.validate(key)){
    key = URLSafeBase64.decode(key);
    if(kv.hasOwnProperty(key)){
      res.json(200, {
        VALUE: kv[key],
        TS: new Date(),
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
        TS: new Date(),
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
    var value = req.swagger.params.body.value.VALUE
    kv[key] = value
    res.json(200, {
      TS: new Date(),
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
