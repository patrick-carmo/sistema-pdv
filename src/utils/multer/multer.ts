import multer from 'multer'
import os from 'os'

export default multer({ dest: os.tmpdir()})
