from fastapi import FastAPI
from contextlib import asynccontextmanager 
from app.core.config import settings
from app import logger # Importa para garantir que o logger seja configurado no início

# Importar os routers dos vertical slices
from app.features.root.router import router as root_router
from app.features.healthcheck.router import router as healthcheck_router
from app.features.dashboard.router import router as dashboard_router

@asynccontextmanager
async def lifespan(app_instance: FastAPI):
    
    logger.info(f"Iniciando aplicação: {settings.APP_NAME}")
    
    # Exemplo: Verificação de conexão com o banco (opcional aqui)
    # from app.core.database import engine # Supondo engine síncrono
    # try:
    #     with engine.connect() as connection:
    #         connection.execute(text("SELECT 1")) # Tenta uma query simples
    #         logger.info("Conexão com o banco de dados verificada com sucesso na inicialização.")
    # except Exception as e:
    #     logger.critical(f"Falha ao conectar com o banco de dados na inicialização: {e}")
    #     # Você pode decidir levantar uma exceção aqui para impedir o início se o DB for crucial.
    #     # raise RuntimeError(f"Não foi possível conectar ao banco de dados: {e}")

    yield # Este é o ponto onde a aplicação efetivamente roda

    # Código a ser executado DEPOIS da aplicação terminar (substitui o antigo "shutdown")
    logger.info(f"Encerrando aplicação: {settings.APP_NAME}")

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_OBJECTIVE,
    version="0.1.0",
    lifespan=lifespan
)

# Incluir os routers na aplicação FastAPI
app.include_router(root_router, tags=["Geral"])
app.include_router(healthcheck_router)
app.include_router(dashboard_router)


if __name__ == "__main__":
    import uvicorn
    logger.info("Executando Uvicorn diretamente do main.py")
    uvicorn.run(app, host="0.0.0.0", port=8000)