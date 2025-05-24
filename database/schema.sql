CREATE TABLE produtores (
    id SERIAL PRIMARY KEY,
    cpf_cnpj VARCHAR(18) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE safras (
    id SERIAL PRIMARY KEY,
    ano INT NOT NULL UNIQUE,
    descricao VARCHAR(50)
);

CREATE TABLE propriedades_rurais (
    id SERIAL PRIMARY KEY,
    id_produtor INT NOT NULL REFERENCES produtores(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado CHAR(2) NOT NULL,
    area_total DECIMAL(10,2) NOT NULL CHECK (area_total > 0),
    area_agricultavel DECIMAL(10,2) NOT NULL,
    area_vegetacao DECIMAL(10,2) NOT NULL
);

CREATE TABLE culturas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE culturas_por_safra (
    id SERIAL PRIMARY KEY,
    id_propriedade INT NOT NULL REFERENCES propriedades_rurais(id) ON DELETE CASCADE,
    id_safra INT NOT NULL REFERENCES safras(id) ON DELETE CASCADE,
    id_cultura INT NOT NULL REFERENCES culturas(id),
    area_plantada DECIMAL(10,2) NOT NULL,
    UNIQUE (id_propriedade, id_safra, id_cultura)
);


--
--
--
CREATE VIEW estatisticas_por_estado AS
SELECT 
    estado,
    COUNT(*) as total_propriedades,
    SUM(area_total) as area_total,
    SUM(area_agricultavel) as area_agricultavel,
    SUM(area_vegetacao) as area_vegetacao
FROM propriedades_rurais
GROUP BY estado;

--
--
--
CREATE VIEW culturas_plantadas AS
SELECT 
    c.nome as cultura,
    COUNT(*) as total_plantios,
    SUM(cps.area_plantada) as area_total
FROM culturas_por_safra cps
JOIN culturas c ON cps.id_cultura = c.id
GROUP BY c.nome;

--
--
--
CREATE VIEW uso_do_solo AS
SELECT 
    'Agricultável' as tipo,
    SUM(area_agricultavel) as area
FROM propriedades_rurais
UNION ALL
SELECT 
    'Vegetação' as tipo,
    SUM(area_vegetacao) as area
FROM propriedades_rurais;