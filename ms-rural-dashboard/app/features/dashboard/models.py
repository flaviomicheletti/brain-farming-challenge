from sqlmodel import SQLModel
from typing import Optional
from decimal import Decimal # Importado caso queira usar Decimal, mas optaremos por float


class DashboardTotaisDataRow(SQLModel):
    """
    Estrutura de dados esperada da view 'dashboard_totais'.
    Esta view retorna uma única linha.
    """
    total_propriedades: int
    area_total_hectares: float
    area_agricultavel: float
    area_vegetacao: float

class DashboardPorEstadoDataRow(SQLModel):
    """
    Estrutura de dados esperada de cada linha da view 'dashboard_por_estado'.
    """
    estado: str
    total_propriedades: int
    area_total: float

class DashboardCulturasDataRow(SQLModel):
    """
    Estrutura de dados esperada de cada linha da view 'dashboard_culturas'.
    """
    cultura: str
    area_total: float

class DashboardUsoSoloDataRow(SQLModel):
    """
    Estrutura de dados esperada de cada linha da view 'dashboard_uso_solo'.
    """
    tipo: str # 'Agricultável' ou 'Vegetação'
    area: float
