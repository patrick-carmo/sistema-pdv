export type User = {
  id: number
  name: string
  email: string
  password: string
}

export type Customer = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  zipCode: string;
  state: string;
}

export type Categories = {
  id: number;
  description: string;
}