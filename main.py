from pathlib import Path

from fastapi import (
    FastAPI,
    Request,
    HTTPException,
    Depends
)

from fastapi.staticfiles import StaticFiles

from fastapi.templating import Jinja2Templates

from sqlalchemy.orm import Session


from database.connection import (
    Base,
    engine,
    get_db
)


# ==============================
# BASE DIRECTORY
# ==============================

BASE_DIR = Path(
    __file__
).resolve().parent


# ==============================
# IMPORTA OS MODELS
# ==============================

from models.produto import Produto

from models.admin import Admin


# ==============================
# IMPORTA AS ROTAS
# ==============================

from routes.produto import (
    router as produto_router
)

from routes.auth import (
    router as auth_router
)

from routes.admin import (
    router as admin_router
)


# ==============================
# FASTAPI
# ==============================

app = FastAPI(
    title="API Landing Page",
    version="1.0.0"
)


# ==============================
# ARQUIVOS ESTÁTICOS
# ==============================

app.mount(
    "/static",
    StaticFiles(
        directory=BASE_DIR / "static"
    ),
    name="static"
)


# ==============================
# TEMPLATES
# ==============================

templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)


# ==============================
# BANCO DE DADOS
# ==============================

Base.metadata.create_all(
    bind=engine
)


# ==============================
# ROTAS DA API
# ==============================

app.include_router(
    produto_router
)

app.include_router(
    auth_router
)

app.include_router(
    admin_router
)


# ==============================
# LOGIN ADMIN
# ==============================

@app.get("/login-admin")
def pagina_login(
    request: Request
):

    return templates.TemplateResponse(
        request=request,
        name="login-adm.html"
    )


# ==============================
# PAINEL ADMIN
# ==============================

@app.get("/admin")
def pagina_admin(
    request: Request
):

    return templates.TemplateResponse(
        request=request,
        name="admin.html"
    )


# ==============================
# VITRINE PÚBLICA
# ==============================

@app.get("/")
def pagina_vitrine(
    request: Request
):

    return templates.TemplateResponse(
        request=request,
        name="tenis.html"
    )


# ==============================
# PÁGINA INDIVIDUAL DO PRODUTO
# ==============================

@app.get(
    "/produto/{produto_id}"
)
def pagina_produto(
    produto_id: int,
    request: Request,
    db: Session = Depends(
        get_db
    )
):

    produto = (
        db.query(
            Produto
        )
        .filter(
            Produto.id == produto_id
        )
        .filter(
            Produto.ativo == True
        )
        .first()
    )


    if not produto:

        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )


    return templates.TemplateResponse(
        request=request,
        name="produto.html",
        context={
            "produto": produto
        }
    )


# ==============================
# PÁGINA DE CONTATO
# ==============================

@app.get(
    "/contato"
)
def pagina_contato(
    request: Request
):

    return templates.TemplateResponse(
        request=request,
        name="contato.html"
    )