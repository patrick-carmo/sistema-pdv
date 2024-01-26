import { Customer } from '../../types/types'

type PartialCustomer = Partial<Customer> & { [key: string]: string | number }

const filterObjectData = (data: PartialCustomer): Customer => {
  const filteredData: PartialCustomer = {}

  Object.keys(data).forEach((key) => {
    if (data[key] !== null) {
      filteredData[key] = data[key]
    }
  })

  return filteredData as Customer
}

export default filterObjectData
