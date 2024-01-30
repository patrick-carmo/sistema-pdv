import fs from 'fs/promises'
import handlebars from 'handlebars'
import { Order } from '../../types/types'

const htmlCompiler = async (file: string, name: string, order: Order): Promise<string | Error> => {
  try {
    const html = await fs.readFile(file)
    const compiler = handlebars.compile(html.toString())

    const data = {
      name,
      order,
    }

    const htmlString = compiler(data)

    return htmlString
  } catch (error: any) {
    return error
  }
}

export default htmlCompiler
