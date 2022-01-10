require('dotenv').config()
const S3 = require("aws-sdk/clients/s3")
const fs = require("fs")


// const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)




const bucketName = process.env.AWS_BUCKET_NAME
const region =  process.env.AWS_BUCKET_REGION
const accessKeyId =   process.env.AWS_ACCESS_KEY
const secretAccessKey =  process.env.AWS_SECRET_KEY


const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// upload a file
const uploadFile = async (file) => {
    const fileStream = fs.createReadStream(file.path)

    // Key -> represents the filename given to the file being uploaded
    // to make file name unique add -> _${Date.now()}
    const uploadParams = {
        Bucket : bucketName,
        Body : fileStream,
        Key : file.filename
    }

    // remove file from public folder
    await unlinkFile(file.path)

    return s3.upload(uploadParams).promise()
}

// downloads a file from s3
// function getFileStream(fileKey) {

const getFileStream = (fileKey) =>{
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }

exports.uploadFile = uploadFile
exports.getFileStream = getFileStream
