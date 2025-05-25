from fastapi.testclient import TestClient
from app.core.config import settings # Para verificar os valores esperados

# A fixture 'client' é injetada automaticamente pelo Pytest a partir do conftest.py
def test_get_root_success(client: TestClient):
    """
    Testa se o endpoint / retorna o status 200 OK e o JSON esperado.
    """
    response = client.get("/") # Faz uma requisição GET para a raiz
    
    # Verifica o código de status
    assert response.status_code == 200
    
    # Prepara o JSON que esperamos receber
    expected_json = {
        "nome_aplicacao": settings.APP_NAME,
        "objetivo": settings.APP_OBJECTIVE
    }
    
    # Verifica se o JSON da resposta é igual ao esperado
    assert response.json() == expected_json

def test_get_root_content_type(client: TestClient):
    """
    Testa se o endpoint / retorna o Content-Type correto.
    """
    response = client.get("/")
    
    # Verifica o header Content-Type
    assert response.headers["content-type"] == "application/json"