const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const multer = require('multer')
const { auth } = require("../middleware/auth");
var ffmpeg = require('fluent-ffmpeg');

//=================================
//             Video
//=================================

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post('/uploadfiles', (req,res) => {
    // 비디오를 서버에 저장한다
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err})
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.get("/getVideos", (req, res) => {

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })

});

router.post('/uploadVideo', (req,res) => {
    // 비디오 정보를 저장한다.
    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success:true})
    })

})
router.post('/getSubscriptionVideos', (req,res) => {
    // 비디오 정보를 저장한다.
    Subscriber.find({ userFrom: req.body.userFrom })
    .exec(( err, SubscriberInfo) => {
        if(err) return res.status(400).send(err);

        let subsvribedUser = [];

        SubscriberInfo.map((Subscriber,index) => {
            subsvribedUser.push(Subscriber.userTo)
        })

        Video.find({ writer: { $in: subsvribedUser }})
        .populate('writer')
        .exec((err,videos) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, videos})
        })


    })

})



router.post('/getVideoDetail', (req,res) => {
    // 비디오 정보를 저장한다.
  Video.findOne({'_id' : req.body.videoId})
  .populate('writer')
  .exec((err, video)=> {
      if(err) return res.status(400).send(err);
      res.status(200).json({success:true, video})
  })

})

router.post('/thumbnail', (req,res) => {
    // 썸네일 생성하고 비디오 러닝타임 가져오기 
    let thumbsFilePath ="";
    let fileDuration ="";


    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        fileDuration = metadata.format.duration;
    })


    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames) {
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });

})



module.exports = router;
