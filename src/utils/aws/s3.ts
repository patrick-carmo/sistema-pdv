// import aws from 'aws-sdk'

// const s3 = new aws.S3({
//   endpoint: process.env.ENDPOINT_S3,
//   region: process.env.BUCKET_REGION,
//   credentials: {
//     accessKeyId: process.env.KEY_ID as string,
//     secretAccessKey: process.env.APP_KEY as string,
//   },
// })

// const uploadFile = async (file: Express.Multer.File, folder: string): Promise<string | Error> => {
//   const { originalname: Key, buffer: Body, mimetype: ContentType } = file

//   try {
//     const data = await s3
//       .upload({
//         Bucket: process.env.BUCKET as string,
//         Key: `${folder}/${Key}`,
//         Body,
//         ContentType,
//       })
//       .promise()

//     const url = data.Location
//     return url
//   } catch (error: any) {
//     return error
//   }
// }

// const deleteFile = async (fileUrl: string): Promise<void | Error> => {
//   const Key = fileUrl.split('.com/')[1].trim()
//   try {
//     await s3
//       .deleteObject({
//         Bucket: process.env.BUCKET as string,
//         Key,
//       })
//       .promise()
//   } catch (error: any) {
//     return error
//   }
// }

// export { uploadFile, deleteFile }
