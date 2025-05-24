-- Consulta 1: Listar produtores e suas propriedades(fazendas)
SELECT p.nome AS produtor, f.nome AS fazenda, f.cidade, f.estado
FROM produtores p
JOIN propriedades_rurais f ON p.id = f.id_produtor
ORDER BY p.nome, f.nome;

-- Consulta 2: Culturas plantadas por safra em uma fazenda específica
SELECT f.nome AS fazenda, s.ano AS safra, c.nome AS cultura, cps.area_plantada
FROM culturas_por_safra cps
JOIN propriedades_rurais f ON cps.id_propriedade = f.id
JOIN safras s ON cps.id_safra = s.id
JOIN culturas c ON cps.id_cultura = c.id
WHERE f.id = 1  -- ID da Fazenda Boa Esperança
ORDER BY s.ano, c.nome;

-- Consulta 3: Dashboard - Total de propriedades(fazendas) e área total
SELECT 
    COUNT(*) AS total_propriedades,
    SUM(area_total) AS area_total_hectares,
    SUM(area_agricultavel) AS area_agricultavel,
    SUM(area_vegetacao) AS area_vegetacao
FROM propriedades_rurais;

-- Consulta 4: Distribuição de culturas (para gráfico de pizza)
SELECT c.nome AS cultura, SUM(cps.area_plantada) AS area_total
FROM culturas_por_safra cps
JOIN culturas c ON cps.id_cultura = c.id
GROUP BY c.nome
ORDER BY area_total DESC;