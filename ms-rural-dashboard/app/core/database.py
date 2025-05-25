from sqlmodel import create_engine, Session
from .config import settings
from loguru import logger

# Usaremos o engine síncrono, já que não foi especificado async para o DB
# Se precisar de async, mude para create_async_engine e use AsyncSession
engine = create_engine(settings.DATABASE_URL, echo=False) # Mude echo=True para ver SQL gerado

def get_session():
    with Session(engine) as session:
        try:
            yield session
            session.commit() # Commit se tudo der certo (embora para GETs não seja estritamente necessário)
        except Exception as e:
            logger.error(f"Erro na sessão do banco de dados: {e}")
            session.rollback()
            raise
        finally:
            session.close()

# Você não vai criar views com SQLModel.metadata.create_all()
# As views devem existir no banco.
# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)