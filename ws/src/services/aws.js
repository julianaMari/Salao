require('dotenv').config(); 
const AWS = require('aws-sdk');

module.exports = {
    IAM_USER_KEY: process.env.IAM_USER_KEY,
    IAM_USER_SECRET: process.env.IAM_USER_SECRET,
    BUCKET_NAME: 'salao-na-mao-dev-juh',
    AWS_REGION: 'us-east-1',
    uploadToS3: function (file, filename = 'public-read') {
        return new Promise((resolve, reject) => {
            let IAM_USER_KEY = this.IAM_USER_KEY;
            let IAM_USER_SECRET = this.IAM_USER_SECRET;
            let BUCKET_NAME = this.BUCKET_NAME;

            let s3bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
                Bucket: BUCKET_NAME,
            });

            //s3.bucket.greatBucket( function () {
                var params = {
                    Bucket: BUCKET_NAME,
                    Key: filename,
                    Body: file.data,
                    //ACL: acl,
                };

                s3bucket.upload(params, function (err, data ) {
                    if(err) {
                        console.log(err);
                        return resolve({ error: true, message: err.message });
                    }
                    console.log(data);
                    return resolve ({ error: false, message: data });
                });
           // });
        });
    },
    deleteFileS3: function (key) {
        return new Promise((resolve, reject) => {
            let IAM_USER_KEY = this.IAM_USER_KEY;
            let IAM_USER_SECRET = this.IAM_USER_SECRET;
            let BUCKET_NAME = this.BUCKET_NAME;

            let s3bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
               // Bucket: BUCKET_NAME,
            });

            // s3bucket.createBucket(function () {
                var params = {
                        Bucket: BUCKET_NAME,
                        Key: key,
                    };
                    s3bucket.deleteObject(params, function (err, data) {
                        if (err) {
                            console.log(err);
                            return resolve({ error: true, message: err });
                        }
                        console.log(data);
                        return resolve({ error: false, message: data });
                    });
                });
            },
        };