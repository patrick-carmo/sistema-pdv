import fs from 'fs'
import { google } from 'googleapis'

const authorization = async () => {
  try {
    const jwt = new google.auth.JWT(process.env.DRIVE_EMAIL, undefined, process.env.DRIVE_KEY, process.env.DRIVE_SCOPE)
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
    parents: [process.env.DRIVE_FOLDER as string],
    mimeType: process.env.DRIVE_MIMETYPE,
  }

  try {
    const file = await service.files.create({
      requestBody: fileMetaData,
      fields: 'id',
    })

    return file.data.id as string
  } catch (error: any) {
    throw error
  }
}

const searchFolder = async (identifier: string): Promise<string | null> => {
  const service = google.drive({ version: 'v3', auth: await authorization() })

  try {
    const res = await service.files.list({
      q: `mimeType='${process.env.DRIVE_MIMETYPE}' and name='${identifier}' and trashed=false`,
      fields: 'files(id, name)',
    })

    console.log('Google Drive API response:', res.data)

    const folders = res.data.files

    if (!folders || folders.length === 0) {
      return null
    }

    const folderId = folders[0].id

    return folderId as string
  } catch (error: any) {
    throw error
  }
}

const uploadFile = async (
  data: Express.Multer.File,
  folder: string
): Promise<{ id: string; webViewLink: string }> => {
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

  try {
    const file = await service.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    })

    return file.data as { id: string; webViewLink: string }
  } catch (error: any) {
    throw error
  }
}

const deleteFile = async (fileId: string): Promise<null> => {
  const service = google.drive({ version: 'v3', auth: await authorization() })
  try {
    await service.files.delete({ fileId })
    return null
  } catch (error: any) {
    throw error
  }
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
//       console.log('Não há pastas para excluir.')
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
