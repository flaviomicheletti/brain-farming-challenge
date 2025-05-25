import sys
from loguru import logger
from .core.config import settings # Importa para garantir que as settings sejam carregadas

# Remove o handler padrão para ter controle total
logger.remove()

# Adiciona um handler para o stdout com formatação e cores
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level=settings.LOG_LEVEL.upper(),
)

# Opcional: Adicionar um handler para arquivo
# Certifique-se que a pasta 'logs' existe ou crie-a
# logger.add(
#     "logs/app_{time}.log",
#     rotation="1 day",  # Novo arquivo a cada dia
#     retention="7 days", # Manter logs por 7 dias
#     compression="zip", # Comprimir logs antigos
#     level="DEBUG"      # Nível de log para o arquivo
# )

logger.info("Logger configurado.")

# Para facilitar importações, pode-se expor o logger aqui
# from loguru import logger # Já importado acima