import knex from '../config/connect'
import { Request, Response } from 'express'
import { Customer } from '../entities/types'
import filterObjectData from '../utils/filterObjectData'

export const registerCustomer = async (req: Request, res: Response) => {
  const {
    name,
    email,
    cpf,
    zipCode,
    street,
    number,
    neighborhood,
    city,
    state,
  }: Customer = req.body

  try {
    const thereEmail = await knex<Customer>('customers')
      .where({ email })
      .first()

    if (thereEmail) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const thereCpf = await knex<Customer>('customers').where({ cpf }).first()

    if (thereCpf) {
      return res.status(400).json({ message: 'CPF já cadastrado' })
    }

    const customer = await knex<Customer>('customers')
      .insert({
        name,
        email,
        cpf,
        zipCode,
        street,
        number,
        neighborhood,
        city,
        state,
      })
      .returning('*')

    const filteredData = filterObjectData(customer[0])

    res.status(201).json(filteredData)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}


const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params

  const {
    name,
    email,
    cpf,
    zipCode,
    street,
    number,
    neighborhood,
    city,
    state,
  }: Customer = req.body

  try{

  }catch{
    
  }
}