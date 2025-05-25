from sqlmodel import create_engine, Session
from .config import settings
from loguru import logger

# Se precisar de async, mude para create_async_engine e use AsyncSession
# Mude echo=True para ver SQL gerado
engine = create_engine(settings.DATABASE_URL, echo=False)

def get_session():
    with Session(engine) as session:
        try:
            yield session
            # Commit se tudo der certo (embora para GETs não seja estritamente necessário)
            session.commit()
        except Exception as e:
            logger.error(f"Erro na sessão do banco de dados: {e}")
            session.rollback()
            raise
        finally:
            session.close()
