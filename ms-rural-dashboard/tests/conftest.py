import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from typing import Generator
from loguru import logger

from app.main import app # Sua aplicação FastAPI
from app.core.database import get_session # A dependência da sessão que queremos sobrescrever
from app.core.config import settings

# --- Configuração do Banco de Dados de Teste ---
# Idealmente, você usaria um banco de dados de teste separado.
# Se for PostgreSQL, pode ser outra database na mesma instância.
# Para simplificar, vamos usar o mesmo DATABASE_URL, mas você pode
# querer sobrescrevê-lo para testes, talvez via variáveis de ambiente.
# Ex: TEST_DATABASE_URL = settings.DATABASE_URL.replace("/seu_banco", "/seu_banco_teste")
# Se estiver usando SQLite em memória para testes (NÃO RECOMENDADO SE O PROJETO USA POSTGRES):
# SQLALCHEMY_DATABASE_URL_TEST = "sqlite:///:memory:"
# test_engine = create_engine(
#     SQLALCHEMY_DATABASE_URL_TEST,
#     connect_args={"check_same_thread": False}, # Necessário para SQLite
#     poolclass=StaticPool,
# )

# Para este exemplo, vamos assumir que você tem um banco PostgreSQL de teste
# ou que seus testes não farão escritas permanentes (usando transações e rollback).
# Se o DATABASE_URL do .env já aponta para um banco de teste, ótimo.
# Caso contrário, defina uma URL de teste aqui ou via variável de ambiente.
# Por exemplo, se você tiver uma variável de ambiente TEST_DATABASE_URL:
# TEST_DB_URL = os.getenv("TEST_DATABASE_URL", settings.DATABASE_URL) # Fallback para a URL principal
TEST_DB_URL = settings.DATABASE_URL # Usando a mesma URL por enquanto

test_engine = create_engine(TEST_DB_URL, echo=False) # echo=True para debug de SQL em testes

# Fixture para criar tabelas (se você tivesse tabelas gerenciadas por SQLModel)
# Para views, isso não é aplicável, pois elas devem existir no banco.
@pytest.fixture(scope="session", autouse=True)
def create_test_tables():
    # SQLModel.metadata.create_all(test_engine) # Descomente se tiver tabelas para criar
    logger.info("Ambiente de teste (DB): tabelas verificadas/criadas (se aplicável).")
    yield
    # SQLModel.metadata.drop_all(test_engine) # Descomente para limpar tabelas após os testes
    logger.info("Ambiente de teste (DB): tabelas limpas (se aplicável).")


# Fixture para a sessão do banco de dados de teste
# Garante que cada teste tenha sua própria transação que é revertida ao final
@pytest.fixture(scope="function")
def db_session_test() -> Generator[Session, None, None]:
    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    logger.debug("Sessão de teste (DB) criada com transação.")
    
    yield session
    
    session.close()
    transaction.rollback() # Garante que os dados não persistam entre testes
    connection.close()
    logger.debug("Sessão de teste (DB) fechada, transação revertida.")


# Fixture para o TestClient do FastAPI, com a dependência de sessão sobrescrita
@pytest.fixture(scope="function")
def client(db_session_test: Session) -> Generator[TestClient, None, None]:
    logger.debug("Configurando TestClient com override de get_session.")
    
    def override_get_session():
        yield db_session_test

    app.dependency_overrides[get_session] = override_get_session
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Limpa o override após o teste
    del app.dependency_overrides[get_session]
    logger.debug("Override de get_session removido.")

# Fixture para criar tabelas (se você tivesse tabelas gerenciadas por SQLModel)
# Para views, isso não é aplicável, pois elas devem existir no banco.
@pytest.fixture(scope="session", autouse=True)
def create_test_tables():
    # SQLModel.metadata.create_all(test_engine) # Descomente se tiver tabelas para criar
    logger.info("Ambiente de teste (DB): tabelas verificadas/criadas (se aplicável).") # Agora logger está definido
    yield
    # SQLModel.metadata.drop_all(test_engine) # Descomente para limpar tabelas após os testes
    logger.info("Ambiente de teste (DB): tabelas limpas (se aplicável).") # Agora logger está definido


# Fixture para a sessão do banco de dados de teste
# Garante que cada teste tenha sua própria transação que é revertida ao final
@pytest.fixture(scope="function")
def db_session_test() -> Generator[Session, None, None]:
    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    logger.debug("Sessão de teste (DB) criada com transação.") # Agora logger está definido
    
    yield session
    
    session.close()
    transaction.rollback() 
    connection.close()
    logger.debug("Sessão de teste (DB) fechada, transação revertida.") # Agora logger está definido


# Fixture para o TestClient do FastAPI, com a dependência de sessão sobrescrita
@pytest.fixture(scope="function")
def client(db_session_test: Session) -> Generator[TestClient, None, None]:
    logger.debug("Configurando TestClient com override de get_session.") # Agora logger está definido
    
    def override_get_session():
        yield db_session_test

    app.dependency_overrides[get_session] = override_get_session
    
    with TestClient(app) as test_client:
        yield test_client
    
    del app.dependency_overrides[get_session]
    logger.debug("Override de get_session removido.") # Agora logger está definido