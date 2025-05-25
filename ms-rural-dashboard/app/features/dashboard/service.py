from sqlmodel import Session, text, SQLModel
from typing import List, Optional, Type, TypeVar
from loguru import logger
from .models import (
    DashboardTotaisDataRow,
    DashboardPorEstadoDataRow,
    DashboardCulturasDataRow,
    DashboardUsoSoloDataRow
)
from .schemas import DashboardConsolidatedData

# Nomes reais das views no PostgreSQL
NOME_VIEW_TOTAIS = "dashboard_totais"
NOME_VIEW_POR_ESTADO = "dashboard_por_estado"
NOME_VIEW_CULTURAS = "dashboard_culturas"
NOME_VIEW_USO_SOLO = "dashboard_uso_solo"

# Tipo genérico para os modelos
T = TypeVar('T', bound=SQLModel)

def fetch_multiple_rows_from_view(db: Session, view_name: str, model_type: Type[T]) -> List[T]:
    """Função genérica para buscar múltiplos dados de uma view e mapear para um modelo."""
    logger.debug(f"Consultando view para múltiplos registros: {view_name}")
    query = text(f"SELECT * FROM {view_name}")
    
    results_raw = db.execute(query).fetchall()
    
    # Pydantic V2 usa model_validate, SQLModel pode usar parse_obj para compatibilidade ou model_validate
    # Vamos garantir que os modelos sejam SQLModel ou Pydantic BaseModel
    data_list = [model_type.model_validate(row._asdict()) for row in results_raw]
    
    logger.debug(f"Dados de {view_name} obtidos: {len(data_list)} registros.")
    return data_list

def fetch_single_row_from_view(db: Session, view_name: str, model_type: Type[T]) -> Optional[T]:
    """Função para buscar uma única linha de uma view e mapear para um modelo."""
    logger.debug(f"Consultando view para registro único: {view_name}")
    query = text(f"SELECT * FROM {view_name} LIMIT 1") # Adiciona LIMIT 1 por segurança
    
    result_raw = db.execute(query).first() # Pega o primeiro registro ou None
    
    if result_raw:
        data_obj = model_type.model_validate(result_raw._asdict())
        logger.debug(f"Dado de {view_name} obtido.")
        return data_obj
    
    logger.warning(f"Nenhum dado encontrado para a view de registro único: {view_name}")
    return None


def get_consolidated_dashboard_data(db: Session) -> DashboardConsolidatedData:
    logger.info("Iniciando consulta aos dados do dashboard.")
    try:
        # View que retorna uma única linha
        data_totais = fetch_single_row_from_view(
            db, NOME_VIEW_TOTAIS, DashboardTotaisDataRow
        )
        
        # Views que retornam múltiplas linhas
        data_por_estado = fetch_multiple_rows_from_view(
            db, NOME_VIEW_POR_ESTADO, DashboardPorEstadoDataRow
        )
        data_culturas = fetch_multiple_rows_from_view(
            db, NOME_VIEW_CULTURAS, DashboardCulturasDataRow
        )
        data_uso_solo = fetch_multiple_rows_from_view(
            db, NOME_VIEW_USO_SOLO, DashboardUsoSoloDataRow
        )

        consolidated_data = DashboardConsolidatedData(
            totais_gerais=data_totais,
            distribuicao_por_estado=data_por_estado,
            culturas_plantadas=data_culturas,
            uso_do_solo=data_uso_solo,
        )
        logger.success("Dados do dashboard consolidados com sucesso.")
        return consolidated_data
    except Exception as e:
        logger.error(f"Erro ao buscar ou consolidar dados do dashboard: {e}", exc_info=True)
        # Re-levanta a exceção para ser tratada no router (HTTPException)
        # ou por um exception handler global.
        # Poderia ser um erro mais específico dependendo da causa raiz.
        raise ValueError(f"Erro ao processar dados do dashboard: {str(e)}")