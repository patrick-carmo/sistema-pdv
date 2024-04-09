import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../../utils/apiError'
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
        throw new BadRequestError('O Arquivo é muito grande. Tamanho permitido: 4Mb')
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        throw new BadRequestError('Apenas um arquivo é permitido')
      }

      throw new BadRequestError(error.message)
    }

    next()
  })
}

export default multerProduct
