**Próximos Passos (Lidando com os Warnings):**

Agora que os testes básicos estão rodando, podemos dar atenção aos warnings para deixar o código mais moderno e evitar problemas futuros.

**1. Corrigir `PydanticDeprecatedSince20` (Configuração de Modelos Pydantic/SQLModel):**

   Este warning indica que a forma de definir configurações dentro dos modelos Pydantic/SQLModel mudou. Em vez de usar uma classe interna `Config`, devemos usar `model_config`.

   *   **Arquivo `app/core/config.py`:**
      Altere o seguinte trecho:
      ```python
      # ANTIGO:
      class Settings(BaseSettings):
          # ... seus campos (APP_NAME, DATABASE_URL, etc.) ...
          class Config:
              env_file = ".env"
              env_file_encoding = 'utf-8'
              extra = 'ignore'
      ```

      Para:
      
      ```python
      # NOVO:
      from pydantic_settings import BaseSettings, SettingsConfigDict # Certifique-se de importar SettingsConfigDict

      class Settings(BaseSettings):
          # ... seus campos (APP_NAME, DATABASE_URL, etc.) ...
          
          model_config = SettingsConfigDict(
              env_file=".env",
              env_file_encoding='utf-8',
              extra='ignore'
          )
      ```

   *   **Arquivo `app/features/dashboard/models.py`:**
      Os modelos SQLModel que definem a estrutura das suas views (`DashboardTotaisDataRow`, etc.) geralmente não precisam de uma `class Config` interna ou `model_config`, a menos que você esteja fazendo algo muito específico. Se eles tiverem uma `class Config:` aninhada, você pode simplesmente removê-la.
      Eles devem parecer com:
      ```python
      from sqlmodel import SQLModel

      class DashboardTotaisDataRow(SQLModel):
          total_propriedades: int
          area_total_hectares: float
          area_agricultavel: float
          area_vegetacao: float

      # ... e assim para os outros modelos de view ...
      ```

   *   **Arquivo `app/features/dashboard/schemas.py` (para `DashboardConsolidatedData`):**
      Seu schema `DashboardConsolidatedData` já parece estar usando a sintaxe correta para Pydantic V2 com `model_config` dentro da definição de classe. No entanto, para ser explícito com `ConfigDict`:
      Altere o seguinte trecho (se o `model_config` não estiver já usando `ConfigDict` explicitamente):
      ```python
      # POSSÍVELMENTE ANTIGO ou IMPLÍCITO:
      from pydantic import BaseModel, Field
      # ... outros imports ...

      class DashboardConsolidatedData(BaseModel):
          # ... seus campos ...
          # Se você tem uma class Config: aqui, ela precisa ser atualizada
          # Se já tem model_config = { ... }, pode ser mais explícito

          # Exemplo de como já poderia estar:
          # model_config = {
          #     "json_schema_extra": {
          #         "examples": [
          #             # ...
          #         ]
          #     }
          # }
      ```
      Para uma forma mais explícita e recomendada com `ConfigDict`:
      ```python
      # NOVO:
      from pydantic import BaseModel, Field, ConfigDict # Certifique-se de importar ConfigDict
      # ... outros imports ...
      from .models import ( # Seus modelos de view
          DashboardTotaisDataRow,
          DashboardPorEstadoDataRow,
          DashboardCulturasDataRow,
          DashboardUsoSoloDataRow
      )
      from typing import List, Optional # Se ainda não importado

      class DashboardConsolidatedData(BaseModel):
          totais_gerais: Optional[DashboardTotaisDataRow] = Field(
              None, description="Estatísticas gerais agregadas de todas as propriedades."
          )
          distribuicao_por_estado: List[DashboardPorEstadoDataRow] = Field(
              default_factory=list, description="Distribuição de propriedades e áreas por estado."
          )
          culturas_plantadas: List[DashboardCulturasDataRow] = Field(
              default_factory=list, description="Total de área plantada por cultura."
          )
          uso_do_solo: List[DashboardUsoSoloDataRow] = Field(
              default_factory=list, description="Distribuição da área total entre agricultável e vegetação."
          )

          model_config = ConfigDict(
              json_schema_extra={
                  "examples": [
                      {
                          "totais_gerais": {
                              "total_propriedades": 9,
                              "area_total_hectares": 3617.85,
                              "area_agricultavel": 2690.00,
                              "area_vegetacao": 927.85
                          },
                          "distribuicao_por_estado": [
                              {"estado": "MS", "total_propriedades": 2, "area_total": 2030.30},
                              {"estado": "PR", "total_propriedades": 3, "area_total": 2170.85},
                          ],
                          "culturas_plantadas": [
                              {"cultura": "Soja", "area_total": 2600.00},
                              {"cultura": "Milho", "area_total": 905.00},
                          ],
                          "uso_do_solo": [
                              {"tipo": "Agricultável", "area": 2690.00},
                              {"tipo": "Vegetação", "area": 927.85}
                          ]
                      }
                  ]
              }
          )
      ```

**2. Corrigir `DeprecationWarning: on_event is deprecated` (Lifespan Events no FastAPI):**

   Este warning do FastAPI indica que os manipuladores de eventos `@app.on_event("startup")` e `@app.on_event("shutdown")` estão obsoletos e devem ser substituídos por um gerenciador de contexto `lifespan`.

   *   **Arquivo `app/main.py`:**
      Modifique seu arquivo `app/main.py` da seguinte forma:

      ```python
      from fastapi import FastAPI
      from contextlib import asynccontextmanager # <<< NOVO IMPORT
      from app.core.config import settings
      # Importe o logger configurado em app/__init__.py
      # Se app/__init__.py configura e expõe 'logger', então apenas 'from app import logger'
      # Se não, você pode precisar de 'from loguru import logger' após a configuração em app/__init__.py
      # Assumindo que a configuração do logger em app/__init__.py acontece e é importada
      from app import logger # Garante que o logger seja configurado antes de ser usado aqui.

      # Importar os routers dos vertical slices
      from app.features.root.router import router as root_router
      from app.features.healthcheck.router import router as healthcheck_router
      from app.features.dashboard.router import router as dashboard_router

      # --- NOVO: Lifespan Context Manager ---
      @asynccontextmanager
      async def lifespan(app_instance: FastAPI): # 'app_instance' é um nome comum para o parâmetro
          # Código a ser executado ANTES da aplicação iniciar (substitui o antigo "startup")
          logger.info(f"Iniciando aplicação: {settings.APP_NAME}")
          
          # Exemplo: Verificação de conexão com o banco (opcional aqui)
          # from app.core.database import engine # Supondo engine síncrono
          # try:
          #     with engine.connect() as connection:
          #         connection.execute(text("SELECT 1")) # Tenta uma query simples
          #         logger.info("Conexão com o banco de dados verificada com sucesso na inicialização.")
          # except Exception as e:
          #     logger.critical(f"Falha ao conectar com o banco de dados na inicialização: {e}")
          #     # Você pode decidir levantar uma exceção aqui para impedir o início se o DB for crucial.
          #     # raise RuntimeError(f"Não foi possível conectar ao banco de dados: {e}")

          yield # Este é o ponto onde a aplicação efetivamente roda

          # Código a ser executado DEPOIS da aplicação terminar (substitui o antigo "shutdown")
          logger.info(f"Encerrando aplicação: {settings.APP_NAME}")
      # --- FIM: Lifespan Context Manager ---

      app = FastAPI(
          title=settings.APP_NAME,
          description=settings.APP_OBJECTIVE,
          version="0.1.0",
          lifespan=lifespan  # <<< ASSOCIAR O LIFESPAN À APLICAÇÃO
          # Adicione outros metadados da API se desejar
      )

      # REMOVA OS ANTIGOS MANIPULADORES DE EVENTO:
      # @app.on_event("startup")
      # async def startup_event():
      #     logger.info(f"Iniciando aplicação: {settings.APP_NAME}")
      #     # ... (código movido para o lifespan)

      # @app.on_event("shutdown")
      # async def shutdown_event():
      #     logger.info(f"Encerrando aplicação: {settings.APP_NAME}")

      # Incluir os routers na aplicação FastAPI
      app.include_router(root_router, tags=["Geral"])
      app.include_router(healthcheck_router) # Tags já definidas no router
      app.include_router(dashboard_router)   # Tags já definidas no router


      # Para executar com `python app/main.py` (opcional, uvicorn é mais comum)
      if __name__ == "__main__":
          import uvicorn
          logger.info("Executando Uvicorn diretamente do main.py")
          # Nota: Se estiver usando o lifespan, o Uvicorn deve ser compatível.
          # Versões recentes do Uvicorn são.
          uvicorn.run(app, host="0.0.0.0", port=8000)
      ```

**Sugestão de Ordem para Aplicar as Mudanças:**

1.  **Primeiro, aplique as mudanças do `lifespan`** em `app/main.py`.
    *   Salve o arquivo.
    *   Rode `pytest` novamente. Os warnings relacionados a `on_event` devem desaparecer.

2.  **Depois, aplique as mudanças do `model_config`** para `pydantic-settings` em `app/core/config.py`.
    *   Salve o arquivo.
    *   Rode `pytest`. Veja se algum warning do Pydantic mudou ou desapareceu.

3.  **Em seguida, revise `app/features/dashboard/models.py`** e remova qualquer `class Config:` interna se houver.
    *   Salve.
    *   Rode `pytest`.

4.  **Por fim, se o warning do Pydantic persistir, atualize `app/features/dashboard/schemas.py`** para usar `model_config = ConfigDict(...)` de forma explícita, como mostrado.
    *   Salve.
    *   Rode `pytest`.

Depois de aplicar essas correções, rode `pytest` novamente. O ideal é que todos os warnings desapareçam, e você continue com `2 passed`.

Espero que esta formatação esteja mais clara! Me diga como fica.