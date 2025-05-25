from fastapi import APIRouter
from app.core.config import settings
from loguru import logger # Importe diretamente o logger configurado

router = APIRouter()

@router.get("/")
async def get_root():
    logger.info("Endpoint / acessado.")
    return {
        "nome_aplicacao": settings.APP_NAME,
        "objetivo": settings.APP_OBJECTIVE
    }