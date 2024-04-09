import knex from '../config/connect'
import { Request, Response } from 'express'
import { BadRequestError } from '../utils/apiError'
import { Customer } from '../types/types'
import filterObjectData from '../utils/customer/filterObjectData'

const registerCustomer = async (req: Request, res: Response) => {
  const { name, email, cpf, zip_code, street, number, neighborhood, city, state }: Customer = req.body

  const emailExists = await knex<Customer>('customers').where({ email }).first()

  if (emailExists) {
    throw new BadRequestError('E-mail já cadastrado')
  }

  const cpfExists = await knex<Customer>('customers').where({ cpf }).first()

  if (cpfExists) {
    throw new BadRequestError('CPF já cadastrado')
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
}

const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as { id: number }
  const { name, email, cpf, zip_code, street, number, neighborhood, city, state }: Customer = req.body

  const customerExists = await knex<Customer>('customers').where({ id }).first()

  if (!customerExists) {
    throw new BadRequestError('Cliente não cadastrado')
  }

  const emailExists = await knex<Customer>('customers').where({ email }).whereNot({ id }).first()

  if (emailExists) {
    throw new BadRequestError('E-mail já cadastrado')
  }

  const cpfExists = await knex<Customer>('customers').where({ cpf }).whereNot({ id }).first()

  if (cpfExists) {
    throw new BadRequestError('CPF já cadastrado')
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
}

const listCustomer = async (_: Request, res: Response) => {
  const customers = await knex<Customer>('customers')

  const filteredData = customers.map<Customer>(customer => filterObjectData(customer))

  res.status(200).json(filteredData)
}

const detailCustomer = async (req: Request, res: Response) => {
  const { id } = req.params

  const customer = await knex<Customer>('customers').where('id', id).first()

  if (!customer) {
    throw new BadRequestError('Cliente não encontrado')
  }

  const filteredData: Customer = filterObjectData(customer)

  res.status(200).json(filteredData)
}

export { registerCustomer, updateCustomer, listCustomer, detailCustomer }
