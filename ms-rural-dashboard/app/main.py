from fastapi import FastAPI
from contextlib import asynccontextmanager 
from app.core.config import settings # Carrega as configurações
from app import logger # Importa para garantir que o logger seja configurado no início

# Importar os routers dos vertical slices
from app.features.root.router import router as root_router
from app.features.healthcheck.router import router as healthcheck_router
from app.features.dashboard.router import router as dashboard_router

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_OBJECTIVE,
    version="0.1.0"
    # Adicione outros metadados da API se desejar
)

# --- NOVO: Lifespan Context Manager ---
@asynccontextmanager
async def lifespan(app_instance: FastAPI): # 'app_instance' é um nome comum para o parâmetro
    # Código a ser executado ANTES da aplicação iniciar (substitui o antigo "startup")
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
# --- FIM: Lifespan Context Manager ---

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_OBJECTIVE,
    version="0.1.0",
    lifespan=lifespan  # <<< ASSOCIAR O LIFESPAN À APLICAÇÃO
    # Adicione outros metadados da API se desejar
)

# # Eventos de Startup e Shutdown
# @app.on_event("startup")
# async def startup_event():
#     logger.info(f"Iniciando aplicação: {settings.APP_NAME}")
#     # Aqui você poderia verificar a conexão com o banco, etc.
#     # Exemplo:
#     # from app.core.database import engine
#     # try:
#     #     with engine.connect() as connection:
#     #         logger.info("Conexão com o banco de dados verificada com sucesso na inicialização.")
#     # except Exception as e:
#     #     logger.critical(f"Falha ao conectar com o banco de dados na inicialização: {e}")
#     #     # Dependendo da criticidade, você pode querer encerrar a aplicação aqui.

# @app.on_event("shutdown")
# async def shutdown_event():
#     logger.info(f"Encerrando aplicação: {settings.APP_NAME}")


# Incluir os routers na aplicação FastAPI
app.include_router(root_router, tags=["Geral"])
app.include_router(healthcheck_router) # Tags já definidas no router
app.include_router(dashboard_router)   # Tags já definidas no router


# Para executar com `python app/main.py` (opcional, uvicorn é mais comum)
if __name__ == "__main__":
    import uvicorn
    logger.info("Executando Uvicorn diretamente do main.py")
    uvicorn.run(app, host="0.0.0.0", port=8000)