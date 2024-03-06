import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import os from 'os'

const upload = multer({
  dest: os.tmpdir(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/heic']

    allowedMimes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Tipo de arquivo inválido'))
  },
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
})

const multerProduct = (field: string) => (req: Request, res: Response, next: NextFunction) => {
  upload.single(field)(req, res, (error: any) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'O Arquivo é muito grande. Tamanho permitido: 4Mb' })
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Apenas um arquivo é permitido' })
      }

      return res.status(400).json({ message: error.message })
    }

    next()
  })
}

export default multerProduct
