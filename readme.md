# Brain Agriculture Challenge - Teste Técnico v2

Eu sou Flávio Micheletti e fiz esse teste no final de semana de 24 e 25 de Maio.
Meu deadline era dia 26 de Maio.

Eu me candidatei para vaga de Backend, então fiz 3 microsserviçoes:

- ms-produtores [Nodejs - Nestjs]
- ms-propriedades-rurais [Nodejs - Nestjs]
- ms-rural-dashboard [Python - FastAPI]


# Docs

- [banco-de-dados](database/readme.md)
- [ms-produtores](ms-produtores/readme.md)
- [ms-propriedades-rurais](ms-propriedades-rurais/readme.md)
- [ms-rural-dashboard](ms-rural-dashboard/readme.md)

**Caso queira dar uma olhada rápida no resultado** (ver a coisa funcionando), basta seguir este readme.


## Inicie o banco de dados

    cd database/
    docker-compose up --build


Se, por um acaso, precisar resetar o "volume":

    // Parar e remover containers
    docker-compose down
    // Listar volumes
    docker volume ls
    // Remover o volume pgdata
    docker volume rm serasa_pgdata


## Execute o microsserviço "ms-produtores" [Nodejs]

    cd ./ms-produtores
    npm i
    npm run start:dev


## Execute o microsserviço "ms-propriedades-rurais" [Nodejs]

    cd ./ms-propriedades-rurais
    npm i
    npm run start:dev


## Execute o microsserviço "ms-rural-dashboard" [Python]

    cd ./ms-rural-dashboard
    python3 -m venv .venv && . .venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload



## Acesse via Postman

Importe a collection abaixo.

[serasa.postman_collection](serasa.postman_collection.json)



    