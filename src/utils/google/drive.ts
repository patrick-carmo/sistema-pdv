import fs from 'fs'
import { google } from 'googleapis'
import env from '../../config/envConfig'

const authorization = async () => {
  try {
    const jwt = new google.auth.JWT(env.DRIVE_EMAIL, undefined, env.DRIVE_KEY, env.DRIVE_SCOPE)
    await jwt.authorize()

    return jwt
  } catch (error: any) {
    throw error
  }
}

const createFolder = async (name: string): Promise<string> => {
  const service = google.drive({ version: 'v3', auth: await authorization() })

  const fileMetaData = {
    name,
    parents: [env.DRIVE_FOLDER],
    mimeType: env.DRIVE_MIMETYPE,
  }

  const file = await service.files.create({
    requestBody: fileMetaData,
    fields: 'id',
  })

  return file.data.id as string
}

const searchFolder = async (identifier: string): Promise<string | null> => {
  const service = google.drive({ version: 'v3', auth: await authorization() })

  const res = await service.files.list({
    q: `mimeType='${env.DRIVE_MIMETYPE}' and name='${identifier}' and trashed=false`,
    fields: 'files(id, name)',
  })

  const folders = res.data.files

  if (!folders || folders.length === 0) {
    return null
  }

  const folderId = folders[0].id

  return folderId as string
}

const uploadFile = async (
  data: Express.Multer.File,
  folder: string
): Promise<{ image_id: string; image_link: string }> => {
  const { path, originalname, mimetype } = data
  const service = google.drive({ version: 'v3', auth: await authorization() })

  const fileMetadata = {
    name: originalname,
    parents: [folder],
  }

  const media = {
    mimeType: mimetype,
    body: fs.createReadStream(path),
  }

  const file = await service.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  })

  const returnData = {
    image_id: file.data.id as string,
    image_link: `https://drive.google.com/file/d/${file.data.id}/preview`,
  }

  return returnData
}

const deleteFile = async (fileId: string): Promise<null> => {
  const service = google.drive({ version: 'v3', auth: await authorization() })
  await service.files.delete({ fileId })
  return null
}

// const deleteAllFolders = async () => {
//   const drive = google.drive({ version: 'v3', auth: await authorization() })

//   try {
//     const response = await drive.files.list({
//       q: `mimeType='${process.env.DRIVE_MIMETYPE}'`,
//       fields: 'files(id, name)',
//     })

//     const folders = response.data.files

//     if (!folders || folders.length === 0) {
//       return
//     }

//     for (const folder of folders) {
//       await drive.files.delete({
//         fileId: folder.id as string,
//       })
//       console.log(`Pasta "${folder.name}" excluída.`)
//     }
//   } catch (error: any) {
//     console.error(error.message)
//   }
// }

// deleteAllFolders()

export { uploadFile, createFolder, searchFolder, deleteFile }
