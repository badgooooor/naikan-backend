const express = require('express')
const router = express.Router()

const pixelsCollections = 'Pixels'

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Pixels routes'
  })
})

module.exports = router
