# Mircosserviço de Rural Dashboard

Este é o Microsserviço responsável pelas informações do Dashboard.

![Image](https://github.com/user-attachments/assets/9acc524e-5f7a-481e-a065-81ed3bcf6d8b)


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