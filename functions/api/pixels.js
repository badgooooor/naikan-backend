const express = require('express')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const router = express.Router()

const db = admin.firestore()
const pixelsCollections = 'pixels'

// Date & Time functions.
function getToday() {
  let today = new Date()
  let year = today.getFullYear().toString()
  let rawMonth = (today.getMonth() + 1)
  let month = (rawMonth > 10) ? rawMonth.toString() : ("0" + rawMonth.toString())  
  let rawDate = today.getDate()
  let date = (rawDate > 10) ? rawDate.toString() : ("0" + rawDate.toString())
  return parseInt(year+month+date)
}

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Pixels routes'
  })
})

router.get('/getAll', (req, res) => {
  firebaseHelper.firestore
    .backup(db, pixelsCollections)
    .then(data => res.status(200).send(data))
    .catch((err) => {
      console.log(err)
      res.status(400)
    })
})

// TODO : Query pixel in each month.
router.get('/monthPixel/:year/:month', (req, res) => {
  let month = (req.params.month > 10) ? (req.params.month.toString()) : ("0"+req.params.month.toString())
  let start = parseInt(req.params.year+month+"01")
  let end = parseInt(req.params.year+month+"31")

  let queryArray = [['date', '>=', start], ['date', '<=', end]]

  firebaseHelper.firestore
    .queryData(db, pixelsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})
// TODO : Query pixel in each year.
router.get('/yearPixel/:year', (req, res) => {
  let start = parseInt(req.params.year+"0101")
  let end = parseInt(req.params.year+"1231")

  let queryArray = [['date', '>=', start], ['date', '<=', end]]

  firebaseHelper.firestore
    .queryData(db, pixelsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

// TODO : Get today pixel.
router.get('/todayPixel/:date', (req, res) => {
  let queryArray = [['date','==', parseInt(req.params.date)]]

  firebaseHelper.firestore
    .queryData(db, pixelsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

router.post('/todayPixel', (req, res) => {
  let today = getToday()
  let todayPixel = {
    angry: req.body.angry,
    confuse: req.body.confuse,
    happy: req.body.happy,
    passive: req.body.passive,
    sad: req.body.sad,
    finalEmotion: req.body.finalEmotion,
    date: today
  }
  firebaseHelper.firestore
    .createNewDocument(db, pixelsCollections, todayPixel)
    .then(docRef => res.status(200).send({
      message: 'Create today pixel!',
      pixel: todayPixel
    }))
    .catch((err) => {
      console.log(err)
      res.error(400).send({
        error: err
      })
    })
})

router.post('/pastPixel', (req, res) => {
  let today = getToday()
  if (req.body.date > today) {
    res.status(400).send({
      message: 'Time requested in request is not in the past',
      today: today,
      requestedDate: req.body.date
    })
  } else {
    let pixel = {
      angry: req.body.angry,
      confuse: req.body.confuse,
      happy: req.body.happy,
      passive: req.body.passive,
      sad: req.body.sad,
      finalEmotion: req.body.finalEmotion,
      date: req.body.date
    }
    firebaseHelper.firestore
    .createNewDocument(db, pixelsCollections, pixel)
    .then(docRef => res.status(200).send({
      message: 'Create pixel!',
      pixel: pixel
    }))
    .catch((err) => {
      console.log(err)
      res.error(400).send({
        error: err
      })
    })
  }
})

// TODO : Update today pixel.
router.put('/todayPixel', (req, res) => {
  
})

module.exports = router
