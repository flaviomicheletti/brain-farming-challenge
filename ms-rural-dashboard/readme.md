


pip install -r requirements.txt


// Para executar com `python app/main.py` (opcional, uvicorn é mais comum)

uvicorn app.main:app --reload

pytest
pytest -v
pytest --cov
pytest --cov=app --cov-report=html