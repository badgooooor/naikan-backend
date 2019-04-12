const express = require('express')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const router = express.Router()
const dateTime = require('../utils/dateTime')

const db = admin.firestore()
const pixelsCollections = 'pixels'

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

router.get('/monthPixel/:year/:month', (req, res) => {
  let queryArray = dateTime.queryRangeMonth(req.params.year, req.params.month)
  firebaseHelper.firestore
    .queryData(db, pixelsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

router.get('/yearPixel/:year', (req, res) => {
  let queryArray = dateTime.queryRangeYear(req.params.year)
  firebaseHelper.firestore
    .queryData(db, pixelsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

router.get('/todayPixel/', (req, res) => {
  let queryArray = [['date','==', dateTime.getToday()]]
  firebaseHelper.firestore
    .queryData(db, pixelsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

router.post('/todayPixel', (req, res) => {
  let today = dateTime.getToday()
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
    .createDocumentWithID(db, pixelsCollections, 'demo-'+today, todayPixel)
    .then(docRef => res.status(200).send({
      message: 'Create today pixel!',
      pixel: todayPixel
    }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ error: err })
    })
})

router.post('/pastPixel', (req, res) => {
  let today = dateTime.getToday()
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
    .createDocumentWithID(db, pixelsCollections, 'demo-'+req.body.date, pixel)
    .then(docRef => res.status(200).send({
      message: 'Create pixel!',
      pixel: pixel
    }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ error: err })
    })
  }
})

router.put('/todayPixel', (req, res) => {
  let today = dateTime.getToday()
  let updatedPixel = {
    angry: req.body.angry,
    confuse: req.body.confuse,
    happy: req.body.happy,
    passive: req.body.passive,
    sad: req.body.sad,
    finalEmotion: req.body.finalEmotion
  }
  firebaseHelper.firestore
    .updateDocument(db, pixelsCollections, 'demo-'+today, updatedPixel)
    .then(docRef => res.status(200).send({
      message: 'Update today pixel!',
      date: today,
      pixel: updatedPixel
    }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ error: err })
    })
})

module.exports = router
