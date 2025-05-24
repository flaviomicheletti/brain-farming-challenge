# Desafio  [Brain Agriculture - Teste Técnico v2]

Flávio Micheletti


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


## Execute o microsserviço "ms-dashboard" [Python]

    python3 -m venv .venv && . .venv/bin/activate
    python app.y


## Acesse via Postman

Importe a collection abaixo.

[serasa.postman_collection](serasa.postman_collection.json)



    