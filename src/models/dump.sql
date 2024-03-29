create table users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null
);

create table categories(
  id serial primary key,
  description text not null
);

insert into categories (description) values
  ('Informática'),
  ('Celulares'),
  ('Beleza e Perfumaria'),
  ('Mercado'),
  ('Livros e Papelaria'),
  ('Brinquedos'),
  ('Moda'),
  ('Bebê'),
  ('Games');

create table products (
  id serial primary key,
  description text not null,
  stock_qty integer not null,
  value integer not null,
  category_id integer not null references categories(id)
);

create table product_images (
  id serial primary key,
  product_id integer not null references products(id),
  folder_id text not null,
  image_id text not null,
  image_link text not null
);

create table customers (
  id serial primary key,
  name text not null,
  email text not null unique,
  cpf text not null unique,
  zip_code text,
  street text,
  number text,
  neighborhood text,
  city text,
  state text
);

create table orders (
  id serial primary key,
  customer_id integer not null references customers(id),
  observation text,
  total_value integer not null
);

create table product_order (
 id serial primary key,
 order_id integer references orders (id),
 product_id integer references products (id),
 product_qty integer not null,
 product_value integer not null
);