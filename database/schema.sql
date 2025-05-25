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


-- VIEWS ESSENCIAIS PARA O DASHBOARD PRINCIPAL --

--
-- 1. View para estatísticas gerais (totais)
--
CREATE OR REPLACE VIEW dashboard_totais AS
SELECT 
    COUNT(*) AS total_propriedades,
    SUM(area_total) AS area_total_hectares,
    SUM(area_agricultavel) AS area_agricultavel,
    SUM(area_vegetacao) AS area_vegetacao
FROM propriedades_rurais;

--
-- 2. View para distribuição por estado (gráfico de pizza)
--
CREATE OR REPLACE VIEW dashboard_por_estado AS
SELECT 
    estado,
    COUNT(*) as total_propriedades,
    SUM(area_total) as area_total
FROM propriedades_rurais
GROUP BY estado
ORDER BY area_total DESC;

--
-- 3. View para culturas plantadas (gráfico de pizza)
--
CREATE OR REPLACE VIEW dashboard_culturas AS
SELECT 
    c.nome AS cultura,
    SUM(cps.area_plantada) AS area_total
FROM culturas_por_safra cps
JOIN culturas c ON cps.id_cultura = c.id
GROUP BY c.nome
ORDER BY area_total DESC;

--
-- 4. View para uso do solo (gráfico de pizza)
--
CREATE OR REPLACE VIEW dashboard_uso_solo AS
SELECT 
    'Agricultável' as tipo,
    SUM(area_agricultavel) as area
FROM propriedades_rurais
UNION ALL
SELECT 
    'Vegetação' as tipo,
    SUM(area_vegetacao) as area
FROM propriedades_rurais;