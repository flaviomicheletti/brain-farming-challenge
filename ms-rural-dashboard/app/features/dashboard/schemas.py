from pydantic import BaseModel, Field, ConfigDict # ConfigDict já está importado
from typing import List, Optional
from .models import (
    DashboardTotaisDataRow,
    DashboardPorEstadoDataRow,
    DashboardCulturasDataRow,
    DashboardUsoSoloDataRow
)
# from datetime import datetime, timezone # Se for adicionar timestamp

class DashboardConsolidatedData(BaseModel):
    """
    Schema para o JSON consolidado retornado pelo endpoint /dashboard.
    """
    totais_gerais: Optional[DashboardTotaisDataRow] = Field(
        None, description="Estatísticas gerais agregadas de todas as propriedades."
    )
    
    distribuicao_por_estado: List[DashboardPorEstadoDataRow] = Field(
        default_factory=list, description="Distribuição de propriedades e áreas por estado."
    )
    
    culturas_plantadas: List[DashboardCulturasDataRow] = Field(
        default_factory=list, description="Total de área plantada por cultura."
    )
    
    uso_do_solo: List[DashboardUsoSoloDataRow] = Field(
        default_factory=list, description="Distribuição da área total entre agricultável e vegetação."
    )
    
    # Exemplo de como adicionar um timestamp da consulta
    # timestamp_consulta: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    # --- CORREÇÃO APLICADA AQUI ---
    # Remova a classe interna "Config" e atribua diretamente a model_config
    # usando ConfigDict.
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "totais_gerais": {
                        "total_propriedades": 9,
                        "area_total_hectares": 3617.85,
                        "area_agricultavel": 2690.00,
                        "area_vegetacao": 927.85
                    },
                    "distribuicao_por_estado": [
                        {"estado": "MS", "total_propriedades": 2, "area_total": 2030.30},
                        {"estado": "PR", "total_propriedades": 3, "area_total": 2170.85},
                        # ... outros estados
                    ],
                    "culturas_plantadas": [
                        {"cultura": "Soja", "area_total": 2600.00},
                        {"cultura": "Milho", "area_total": 905.00},
                        # ... outras culturas
                    ],
                    "uso_do_solo": [
                        {"tipo": "Agricultável", "area": 2690.00},
                        {"tipo": "Vegetação", "area": 927.85}
                    ]
                }
            ]
        }
    )
    # --- FIM DA CORREÇÃO ---