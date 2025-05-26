# Mircosserviço de Rural Dashboard

Este é o Microsserviço responsável pelas informações do Dashboard.

![endpoits-dashboard](https://github.com/user-attachments/assets/f231fede-10b7-4022-aaf8-9802aecddddb)


## Instalação

    pip install -r requirements.txt


## Iniciar

Para executar com `python app/main.py` (opcional, uvicorn é mais comum)

    uvicorn app.main:app --reload


## Rodar os testes

    pytest
    pytest -v
    pytest --cov
    pytest --cov=app --cov-report=html