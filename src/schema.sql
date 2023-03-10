CREATE DATABASE dindin;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL, 
  email TEXT UNIQUE,
  senha TEXT NOT NULL 
);


CREATE TABLE categorias (
  id SERIAL PRIMARY KEY NOT NULL,
  descricao TEXT	
);


INSERT INTO categorias 
(descricao)
VALUES
('Alimentação'), ('Assinaturas e Serviços'), ('Casa'), ('Mercado'), ('Cuidados Pessoais'),
('Educação'), ('Família'), ('Lazer'), ('Pets'), ('Presentes'), ('Roupas'), ('Saúde'), 
('Transporte'), ('Salário'), ('Vendas'), ('Outras receitas'), ('Outras despesas');


CREATE TABLE transacoes (
  id SERIAL PRIMARY KEY NOT NULL,
  descricao TEXT,
  valor FLOAT(2),
  data DATE,
  categoria_id INTEGER REFERENCES categorias(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  tipo TEXT
); 