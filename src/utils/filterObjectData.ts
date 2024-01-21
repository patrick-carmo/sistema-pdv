import { Customer } from '../entities/types'

declare function ObjectKeys<T>(o: T): (keyof T)[]

const filterObjectData = (data: Customer): Customer => {

  const filteredData: any = {}
  ObjectKeys(data).forEach((key: keyof Customer) => {
    if (data[key] !== null) {
      filteredData[key] = data[key]
    }
  })

  return filteredData
}

export default filterObjectData
