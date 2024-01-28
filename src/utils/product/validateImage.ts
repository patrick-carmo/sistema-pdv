const validateImage = (file: Express.Multer.File): string | null => {
  const { size } = file

  const format: string = file.mimetype.split('/').splice(0, 1).join()

  if (format !== 'image') {
    return 'Arquivo não é uma imagem'
  }

  if (size > 4e6) {
    return 'Arquivo muito grande, tamanho permitido: 4MB'
  }

  return null
}

export default validateImage
