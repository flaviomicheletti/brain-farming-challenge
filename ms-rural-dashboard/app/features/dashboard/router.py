from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.core.database import get_session
from loguru import logger
from .service import get_consolidated_dashboard_data
from .schemas import DashboardConsolidatedData

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/", response_model=DashboardConsolidatedData)
async def get_dashboard_data(db: Session = Depends(get_session)):
    logger.info("Requisição recebida no endpoint /dashboard")
    try:
        dashboard_data = get_consolidated_dashboard_data(db)
        return dashboard_data
    except ValueError as ve: # Erro específico do nosso service
        logger.warning(f"Erro de valor ao buscar dados do dashboard: {ve}")
        raise HTTPException(status_code=400, detail=str(ve)) # Bad Request se for um erro de input/lógica
    except Exception as e:
        logger.error(f"Erro inesperado ao obter dados do dashboard: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Erro interno ao processar dados do dashboard.")