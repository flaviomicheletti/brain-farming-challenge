from sqlmodel import SQLModel # Usaremos SQLModel como se fosse Pydantic BaseModel aqui
from typing import Optional # Embora as views não devam ter nulos aqui, é uma boa prática considerar
from decimal import Decimal # Importado caso queira usar Decimal, mas optaremos por float

# --- Modelos para os dados de cada View ---
# Baseados no schema fornecido

class DashboardTotaisDataRow(SQLModel):
    """
    Estrutura de dados esperada da view 'dashboard_totais'.
    Esta view retorna uma única linha.
    """
    total_propriedades: int
    area_total_hectares: float # Originalmente NUMERIC
    area_agricultavel: float   # Originalmente NUMERIC
    area_vegetacao: float      # Originalmente NUMERIC

class DashboardPorEstadoDataRow(SQLModel):
    """
    Estrutura de dados esperada de cada linha da view 'dashboard_por_estado'.
    """
    estado: str
    total_propriedades: int
    area_total: float # Originalmente NUMERIC

class DashboardCulturasDataRow(SQLModel):
    """
    Estrutura de dados esperada de cada linha da view 'dashboard_culturas'.
    """
    cultura: str
    area_total: float # Originalmente NUMERIC

class DashboardUsoSoloDataRow(SQLModel):
    """
    Estrutura de dados esperada de cada linha da view 'dashboard_uso_solo'.
    """
    tipo: str # 'Agricultável' ou 'Vegetação'
    area: float   # Originalmente NUMERIC

# Não precisamos de `table=True` aqui, pois não estamos criando tabelas para as views
# com SQLModel. Estes são apenas para estruturar os dados lidos.