-- CONSULTAS AUXILIARES --

/*
Consulta: estatisticas_por_estado

Propósito: Mostra uma análise detalhada por estado, incluindo áreas totais, agrícolas e de vegetação.
Como funciona: 
  - Agrupa todas as propriedades por estado
  - Calcula totais de propriedades e áreas
  - Útil para análises regionais comparativas
Por que esses dados são importantes:
  - Permite identificar quais estados têm maior concentração de terras agrícolas
  - Mostra a distribuição entre área cultivável e preservada por estado
*/
SELECT 
    estado,
    COUNT(*) as total_propriedades,
    SUM(area_total) as area_total,
    SUM(area_agricultavel) as area_agricultavel,
    SUM(area_vegetacao) as area_vegetacao
FROM propriedades_rurais
GROUP BY estado;

/*
Consulta: culturas_plantadas

Propósito: Lista todas as culturas e suas áreas plantadas totais (independente de safra)
Como funciona:
  - Soma todas as áreas plantadas para cada cultura
  - Agrupa pelo nome da cultura
Por que esses dados são importantes:
  - Mostra quais culturas dominam a produção
  - Permite identificar culturas secundárias
*/
SELECT 
    c.nome as cultura,
    COUNT(*) as total_plantios,
    SUM(cps.area_plantada) as area_total
FROM culturas_por_safra cps
JOIN culturas c ON cps.id_cultura = c.id
GROUP BY c.nome;

/*
Consulta: produtores_com_propriedades

Propósito: Listar todos os produtores com suas respectivas propriedades
Como funciona:
  - Faz um JOIN entre produtores e propriedades
  - Ordena por nome do produtor e depois por nome da fazenda
Uso típico:
  - Cadastro completo de propriedades
  - Relacionamento produtor-fazenda
*/
SELECT 
    p.nome AS produtor, 
    p.cpf_cnpj,
    f.nome AS fazenda, 
    f.cidade, 
    f.estado,
    f.area_total
FROM produtores p
JOIN propriedades_rurais f ON p.id = f.id_produtor
ORDER BY p.nome, f.nome;

/*
Consulta: historico_culturas_por_fazenda

Propósito: Mostrar o histórico completo de culturas plantadas em cada fazenda por safra
Como funciona:
  - Relaciona 4 tabelas (propriedades, safras, culturas e plantios)
  - Filtra por ID de propriedade
Uso típico:
  - Análise da rotação de culturas
  - Histórico agrícola da propriedade
*/
SELECT 
    f.nome AS fazenda, 
    s.ano AS safra, 
    c.nome AS cultura, 
    cps.area_plantada
FROM culturas_por_safra cps
JOIN propriedades_rurais f ON cps.id_propriedade = f.id
JOIN safras s ON cps.id_safra = s.id
JOIN culturas c ON cps.id_cultura = c.id
ORDER BY f.nome, s.ano;