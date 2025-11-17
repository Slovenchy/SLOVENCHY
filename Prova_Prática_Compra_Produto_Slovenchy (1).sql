-- Criar o banco de dados
CREATE DATABASE db_compra_produto;

-- Conectar ao banco (no pgAdmin selecione db_compra_produto antes de rodar o restante)

-- Tabela Cliente
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    dt_nasc DATE,
    email VARCHAR(80),
    sexo CHAR(1),
    telefone VARCHAR(50),
    cep CHAR(8),
    endereco VARCHAR(80)
);

-- Tabela Atendente
CREATE TABLE atendente (
    id_atendente SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    matricula CHAR(11) UNIQUE NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    rg CHAR(8),
    pis CHAR(11),
    telefone VARCHAR(50),
    email VARCHAR(80),
    endereco VARCHAR(80),
    cep CHAR(8)
);

-- Tabela Produto
CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    marca VARCHAR(20),
    descricao VARCHAR(300),
    valor_unitario NUMERIC(10,2) NOT NULL
);

-- Tabela Compra
CREATE TABLE compra (
    id_compra SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES cliente(id_cliente),
    id_atendente INT REFERENCES atendente(id_atendente),
    forma_pagamento VARCHAR(10),
    vl_total NUMERIC(10,2),
    dt_compra DATE,
    hora_pagamento TIMESTAMP
);

-- Tabela Compra_Produto
CREATE TABLE compra_produto (
    id_compra INT REFERENCES compra(id_compra),
    id_produto INT REFERENCES produto(id_produto),
    quantde_produto NUMERIC(5),
    vl_parcial NUMERIC(10,2),
    PRIMARY KEY (id_compra, id_produto)
);

-- Clientes
INSERT INTO cliente (nome, cpf, dt_nasc, email, sexo, telefone, cep, endereco) VALUES
('Maria Silva', '12345678901', '1990-03-15', 'maria.silva@email.com', 'F', '65999990001', '78000000', 'Av. do CPA, 100'),
('João Pereira', '98765432100', '1985-11-02', 'joao.pereira@email.com', 'M', '65999990002', '78010010', 'Rua das Flores, 250'),
('Ana Costa', '11122233344', '1998-07-21', 'ana.costa@email.com', 'F', '65999990003', '78020020', 'Rua Primavera, 77');

-- Atendentes
INSERT INTO atendente (nome, matricula, cpf, rg, pis, telefone, email, endereco, cep) VALUES
('Felipe Douglas', 'ATD00000001', '22233344455', '12345678', '55566677788', '65999991001', 'felipe@loja.com', 'Av. Rubens de Mendonça, 500', '78048000'),
('Carlos Souza', 'ATD00000002', '33344455566', '87654321', '66677788899', '65999991002', 'carlos@loja.com', 'Rua Barão de Melgaço, 120', '78005000'),
('Mariana Santos', 'ATD00000003', '44455566677', '11223344', '77788899900', '65999991003', 'mariana@loja.com', 'Av. Isaac Póvoas, 900', '78030000');

-- Produtos
INSERT INTO produto (marca, descricao, valor_unitario) VALUES
('Acme', 'Notebook 15" i5 8GB 256GB SSD', 3500.00),
('Acme', 'Smartphone 128GB Tela 6.5"', 2200.00),
('Beta', 'Fone Bluetooth Noise Cancelling', 450.00);

-- Compras
INSERT INTO compra (id_cliente, id_atendente, forma_pagamento, vl_total, dt_compra, hora_pagamento) VALUES
(1, 1, 'Cartão', 3650.00, '2025-09-28', '2025-09-28 18:35:00'),
(2, 2, 'Pix', 2650.00, '2025-10-05', '2025-10-05 10:12:00'),
(3, 3, 'Dinheiro', 2200.00, '2025-11-10', '2025-11-10 15:45:00');

-- Itens das compras
INSERT INTO compra_produto VALUES
(1, 1, 1, 3500.00),
(1, 2, 1, 150.00),
(2, 2, 1, 2200.00),
(2, 3, 1, 450.00),
(3, 2, 1, 2200.00);


-- 1. Nome do cliente, atendente e valor total
SELECT cli.nome AS cliente, atd.nome AS atendente, c.vl_total
FROM compra c
JOIN cliente cli ON cli.id_cliente = c.id_cliente
JOIN atendente atd ON atd.id_atendente = c.id_atendente;

-- 2. Produtos vendidos, quantidade e valor parcial
SELECT cp.id_compra, p.descricao, cp.quantde_produto, cp.vl_parcial
FROM compra_produto cp
JOIN produto p ON p.id_produto = cp.id_produto;

-- 3. Compras após 01/10/2025
SELECT * FROM compra WHERE dt_compra > '2025-10-01';

-- 4. Clientes com mais de uma compra
SELECT cli.nome, COUNT(c.id_compra) AS qtd_compras
FROM cliente cli
JOIN compra c ON cli.id_cliente = c.id_cliente
GROUP BY cli.nome
HAVING COUNT(c.id_compra) > 1;

-- 1. Adicionar coluna Estoque
ALTER TABLE produto ADD COLUMN estoque INTEGER;

-- 2. Atualizar estoque para 100
UPDATE produto SET estoque = 100;

-- 3. Atualizar e-mail da Maria Silva
UPDATE cliente SET email = 'maria.silva@novoemail.com'
WHERE nome = 'Maria Silva';

-- 1. Total geral de vendas
SELECT SUM(vl_total) AS total_vendas FROM compra;

-- 2. Produto mais caro
SELECT descricao, valor_unitario
FROM produto
ORDER BY valor_unitario DESC
LIMIT 1;

-- 3. Atendentes e número de vendas
SELECT a.nome, COUNT(c.id_compra) AS vendas
FROM atendente a
LEFT JOIN compra c ON a.id_atendente = c.id_atendente
GROUP BY a.nome;

