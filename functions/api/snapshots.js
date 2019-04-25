const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const format = require('util').format
const firebaseHelper = require('firebase-functions-helper')
const dateTime = require('../utils/dateTime')
//const {Storage} = require('@google-cloud/storage')
const Multer = require('multer')
//const multipart = require('connect-multiparty')
//const multipartmiddleware = multipart()
//const mv = require('mv')
//const path = require('path')
//const storage = new Storage()

//const keyFilename = '../config/serviceAccount.json'
//const projectId = 'naikan-87838'
//const bucketName = 'naikan87838.appspot.com'
//const fileName = './testSnapshot.jpg'

const bucket = admin.storage().bucket()

const db = admin.firestore()
const snapshotsCollections = 'snapshots'

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5*1024*1024 //file size < 5mb
  }
})

/*
const options = {
  // The path to which the file should be downloaded, e.g. "./file.txt"
  destination: destFilename,
};
*/
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
  let snapShotRef = 'demo-'+req.params.date
  firebaseHelper.firestore
    .getDocument(db,snapshotsCollections,snapShotRef)
    .then(data => res.status(200).send(data))
    .catch((err) => {
      console.log(err)
      res.status(400)
    })
})

router.post('/addSnapshot', (req, res) => {
  let today = dateTime.getToday()
  let snapShot = {
    title: req.body.title,
    detail: req.body.detail,
    time: req.body.time,
    place: req.body.place,
    date: today
  }
  firebaseHelper.firestore
    .createDocumentWithID(db, snapshotsCollections, 'demo-'+today, snapShot)
    .then(docRef => res.status(200).send({
      message: 'Add snapshot!',
      snapShot: snapShot
    }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ error: err })
    })
})
/*
router.get('/test', (req, res) => {
  let fileName = req.params.file
  bucket.file(fileName).download(options)
  .then(data => res.status(200).send(data))
    .catch((err) => {
      console.log(err)
      res.status(400)
    })
})*/
/*
router.post('/addSnapshot',(req,res) => {
  let file = req.file
  if(file){
    bucket.upload(file, {
      gzip: true,
      metadata:{
        cacheControl: 'public, max-age=31536000',
      }
    })
    .then(docRef => res.status(200).send({
      message: 'Add snapshot!',
    }))
    .catch((err) => {
      console.log(err)
      res.status(400).send({ error: err })
    })
  }
})
*/
/*
router.post('/addSnapshot',(req, res, next) => {
   const uploadTo = 'snapShot/'+userId+'.'+fileExt

   console.log('upload to '+uploadTo);

   bucket.upload(fileName,{
         destination:uploadTo,
         public:true,
         metadata: {contentType: fileMime,cacheControl: "public, max-age=300"}
     }, function(err, file) {
         if(err)
         {
             console.log(err);
             res.json({

                      "success":false,
                      "error":err
                 })
         }
         console.log(createPublicFileURL(uploadTo));
     })
})

function createPublicFileURL(storageName) {
  return `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`;

}
const gcFile = bucket.file(uploadTo);
gcFile.exists((err,exists)=>console.log(err||exists));*/
/*
router.post('/addSnapshot', multer.single('file'), (req, res, next) => {
  let file = req.file
  if(!file){
    res.status(400).send('No file uploaded.')
    return
  }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    next(err);
  })

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    res.status(200).send(publicUrl)
  })

  blobStream.end(req.file.buffer)
})
*/


/* ********************************
**** upload image (not working) ****
**********************************/
router.post('/uploadImage', multer.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  let file = req.file;
  if (file) {
    uploadImageToStorage(file).then((success) => {
        res.status(200).send({
        status: 'success'
      })
      return
    }).catch((err) => {
      console.error(err);
      res.status(400).send({ error: err })
    });
  }
});

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No image file'));
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      reject(new Error('Something is wrong! Unable to upload at the moment.'));
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
}


/*
//Import google cloud libraly
const {Storage} = require('@google-cloud/storage')

//create a client
const storage = new Storage()

const bucketName = 'snapShot' //bucket folder
const filename = './testSnapshot.jpg' //local file

async function createBucket(){
  await storage.createBucket(bucketName)
  console.log('Bucket ${bucketName} created.')
}

/*async function addSnapshot(){
await storage.bucket(bucketName).upload(filename,{
  gzip: true,
  metadata:{
    cacheControl: 'public, max-age=31536000',
  },
})
console.log('${filename} uploaded to ${bucketName}.')
}

createBucket()
*/

module.exports = router