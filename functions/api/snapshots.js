const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const dateTime = require('../utils/dateTime')

const db = admin.firestore()
const snapshotsCollections = 'snapshots'

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Snapshots routes'
  })
})

router.get('/getAll', (req, res) => {
  firebaseHelper.firestore
    .backup(db, snapshotsCollections)
    .then(data => res.status(200).send(data))
    .catch((err) => {
      console.log(err)
      res.status(400)
    })
})

router.get('/monthSnapshot/:year/:month', (req, res) => {
  let queryArray = dateTime.queryRangeMonth(req.params.year, req.params.month)
  firebaseHelper.firestore
    .queryData(db, snapshotsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

router.get('/yearSnapshot/:year', (req, res) => {
  let queryArray = dateTime.queryRangeYear(req.params.year)
  firebaseHelper.firestore
    .queryData(db, snapshotsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

//date in format yyyymmdd e.g. 20190425
router.get('/Snapshot/:date', (req, res) => {
  let snapshotRef = 'demo-'+req.params.date
  firebaseHelper.firestore
    .getDocument(db,snapshotsCollections,snapshotRef)
    .then(data => res.status(200).send(data))
    .catch((err) => {
      console.log(err)
      res.status(400)
    })
})

router.post('/addSnapshot', (req, res) => {
    let snapshot = {
    title: req.body.title,
    detail: req.body.detail,
    time: req.body.time,
    place: req.body.place,
    date: req.body.date
    }
    firebaseHelper.firestore
    .createDocumentWithID(db, snapshotsCollections, 'demo-'+req.body.date, snapshot)
    .then(docRef => res.status(200).send({
      message: 'Add snapshot!',
      snapshot: snapshot
    }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ error: err })
    })
  
})

module.exports = router