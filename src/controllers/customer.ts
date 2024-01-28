import knex from '../config/connect'
import { Request, Response } from 'express'
import { Customer } from '../types/types'
import filterObjectData from '../utils/customer/filterObjectData'

const registerCustomer = async (req: Request, res: Response) => {
  const { name, email, cpf, zip_code, street, number, neighborhood, city, state }: Customer = req.body

  try {
    const emailExists = await knex<Customer>('customers').where({ email }).first()

    if (emailExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const cpfExists = await knex<Customer>('customers').where({ cpf }).first()

    if (cpfExists) {
      return res.status(400).json({ message: 'CPF já cadastrado' })
    }

    const customer = await knex<Customer>('customers')
      .insert({
        name,
        email,
        cpf,
        zip_code,
        street,
        number,
        neighborhood,
        city,
        state,
      })
      .returning('*')

    const filteredData: Customer = filterObjectData(customer[0])

    res.status(201).json(filteredData)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as { id: number }
  const { name, email, cpf, zip_code, street, number, neighborhood, city, state }: Customer = req.body

  try {
    const customerExists = await knex<Customer>('customers').where({ id }).first()

    if (!customerExists) {
      return res.status(400).json({ message: 'Cliente não cadastrado' })
    }

    const emailExists = await knex<Customer>('customers').where({ email }).whereNot({ id }).first()

    if (emailExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const cpfExists = await knex<Customer>('customers').where({ cpf }).whereNot({ id }).first()

    if (cpfExists) {
      return res.status(400).json({ message: 'CPF já cadastrado' })
    }

    await knex<Customer>('customers').where({ id }).update({
      name,
      email,
      cpf,
      zip_code,
      street,
      number,
      neighborhood,
      city,
      state,
    })

    res.status(204).send()
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const listCustomer = async (_: Request, res: Response) => {
  try {
    const customers = await knex<Customer>('customers')

    const filteredData = customers.map<Customer>(customer => filterObjectData(customer))

    res.status(200).json(filteredData)
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const detailCustomer = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const customer = await knex<Customer>('customers').where('id', id).first()

    if (!customer) {
      return res.status(400).json({ message: 'Cliente não cadastrado' })
    }

    const filteredData: Customer = filterObjectData(customer)

    res.status(200).json(filteredData)
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export { registerCustomer, updateCustomer, listCustomer, detailCustomer }
