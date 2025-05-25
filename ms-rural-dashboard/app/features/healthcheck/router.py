from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from loguru import logger

router = APIRouter(prefix="/healthcheck", tags=["Healthcheck"])

@router.get("/")
async def get_healthcheck(db: Session = Depends(get_session)):
    logger.info("Executando healthcheck...")
    try:
        # Tenta uma consulta simples ao banco de dados
        db.execute(select(1)) # SQLAlchemy Core select
        logger.info("Healthcheck OK: Conexão com o banco de dados bem-sucedida.")
        return {"status": "ok", "database_connection": "ok"}
    except Exception as e:
        logger.error(f"Healthcheck FALHOU: Erro ao conectar com o banco de dados - {e}")
        # Não levante HTTPException aqui para que o serviço ainda responda,
        # mas indique o problema no status.
        # Se a falha do DB for crítica para o healthcheck, pode levantar 503.
        return {"status": "error", "database_connection": "failed", "detail": str(e)}