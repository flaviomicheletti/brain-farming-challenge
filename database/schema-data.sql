-- Inserindo culturas agrícolas
INSERT INTO Culturas (nome) VALUES
('Soja'),
('Milho'),
('Café'),
('Cana-de-Açúcar'),
('Algodão'),
('Trigo'),
('Arroz'),
('Feijão');

-- Inserindo anos de safra
INSERT INTO safras (ano, descricao) VALUES
(2020, 'Safra 2020'),
(2021, 'Safra 2021'),
(2022, 'Safra 2022'),
(2023, 'Safra 2023');

-- Produtores (pessoas físicas e jurídicas)
INSERT INTO produtores (cpf_cnpj, nome) VALUES
('123.456.789-09', 'João da Silva'),
('987.654.321-00', 'Maria Oliveira'),
('11.222.333/0001-44', 'Agropecuária Santa Fé Ltda'),
('55.666.777/0001-88', 'Fazendas do Vale S/A'),
('444.555.666-77', 'Carlos Mendes'),
('22.333.444/0001-55', 'Cooperativa Agrícola Primavera');

-- Propriedades Rurais (fazenda dos produtores)
INSERT INTO propriedades_rurais (id_produtor, nome, cidade, estado, area_total, area_agricultavel, area_vegetacao) VALUES
(1, 'Fazenda Boa Esperança', 'Ribeirão Preto', 'SP', 150.50, 100.00, 50.50),
(1, 'Sítio São João', 'Piracicaba', 'SP', 50.25, 30.00, 20.25),
(2, 'Fazenda Recanto Feliz', 'Uberaba', 'MG', 320.75, 250.00, 70.75),
(3, 'Fazenda Santa Fé', 'Dourados', 'MS', 1250.00, 900.00, 350.00),
(3, 'Fazenda Nova Era', 'Campo Grande', 'MS', 780.30, 600.00, 180.30),
(4, 'Fazenda Vale Verde', 'Londrina', 'PR', 540.60, 400.00, 140.60),
(5, 'Sítio das Palmeiras', 'Passo Fundo', 'RS', 85.40, 60.00, 25.40),
(6, 'Fazenda Cooperativa', 'Cascavel', 'PR', 1200.00, 950.00, 250.00),
(6, 'Fazenda Modelo', 'Maringá', 'PR', 430.25, 300.00, 130.25);

-- culturas plantadas por safra em cada fazenda
INSERT INTO culturas_por_safra (id_propriedade, id_safra, id_cultura, area_plantada) VALUES
-- Fazenda Boa Esperança (id=1)
(1, 1, 1, 70.00), -- Soja 2020
(1, 1, 2, 30.00), -- Milho 2020
(1, 2, 1, 80.00), -- Soja 2021
(1, 2, 2, 20.00), -- Milho 2021
(1, 3, 3, 50.00), -- Café 2022
(1, 3, 1, 50.00), -- Soja 2022

-- Sítio São João (id=2)
(2, 1, 3, 15.00), -- Café 2020
(2, 2, 3, 20.00), -- Café 2021
(2, 3, 3, 25.00), -- Café 2022
(2, 4, 3, 30.00), -- Café 2023

-- Fazenda Recanto Feliz (id=3)
(3, 1, 1, 150.00), -- Soja 2020
(3, 1, 2, 100.00), -- Milho 2020
(3, 2, 1, 180.00), -- Soja 2021
(3, 2, 4, 70.00),  -- Cana 2021
(3, 3, 5, 120.00), -- Algodão 2022
(3, 4, 5, 150.00), -- Algodão 2023

-- Fazenda Santa Fé (id=4)
(4, 1, 1, 500.00), -- Soja 2020
(4, 2, 1, 550.00), -- Soja 2021
(4, 3, 1, 600.00), -- Soja 2022
(4, 4, 1, 650.00), -- Soja 2023

-- Fazenda Nova Era (id=5)
(5, 1, 4, 300.00), -- Cana 2020
(5, 2, 4, 350.00), -- Cana 2021
(5, 3, 4, 400.00), -- Cana 2022
(5, 4, 4, 450.00), -- Cana 2023

-- Fazenda Vale Verde (id=6)
(6, 1, 1, 200.00), -- Soja 2020
(6, 1, 2, 200.00), -- Milho 2020
(6, 2, 6, 150.00), -- Trigo 2021
(6, 2, 7, 150.00), -- Arroz 2021
(6, 3, 8, 100.00), -- Feijão 2022
(6, 4, 1, 250.00), -- Soja 2023

-- Sítio das Palmeiras (id=7)
(7, 1, 8, 30.00),  -- Feijão 2020
(7, 2, 8, 35.00),  -- Feijão 2021
(7, 3, 2, 40.00), -- Milho 2022
(7, 4, 2, 45.00), -- Milho 2023

-- Fazenda Cooperativa (id=8)
(8, 1, 1, 500.00), -- Soja 2020
(8, 1, 2, 450.00), -- Milho 2020
(8, 2, 1, 550.00), -- Soja 2021
(8, 3, 5, 400.00), -- Algodão 2022
(8, 4, 5, 450.00), -- Algodão 2023

-- Fazenda Modelo (id=9)
(9, 1, 3, 150.00), -- Café 2020
(9, 2, 3, 150.00), -- Café 2021
(9, 3, 3, 150.00), -- Café 2022
(9, 4, 3, 150.00); -- Café 2023