from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form
)

from sqlalchemy.orm import Session

from pathlib import Path
from uuid import uuid4

import shutil


from database.connection import get_db

from models.produto import Produto

from schemas.produto import ProdutoResponse

from security.auth import get_current_admin


# ==============================
# PASTA DAS IMAGENS
# ==============================

BASE_DIR = Path(
    __file__
).resolve().parent.parent


PASTA_IMAGENS = (
    BASE_DIR
    / "static"
    / "images"
    / "produtos"
)


PASTA_IMAGENS.mkdir(
    parents=True,
    exist_ok=True
)


# ==============================
# ROUTER ADMINISTRATIVO
# ==============================

router = APIRouter(
    prefix="/admin",
    tags=[
        "Administração"
    ],
    dependencies=[
        Depends(
            get_current_admin
        )
    ]
)


# ==============================
# SALVAR IMAGEM
# ==============================

def salvar_imagem(
    imagem: UploadFile
):

    # Verifica se existe tipo de arquivo

    if not imagem.content_type:

        raise HTTPException(
            status_code=
            status.HTTP_400_BAD_REQUEST,

            detail=
            "Arquivo inválido."
        )


    # Verifica se é uma imagem

    if not imagem.content_type.startswith(
        "image/"
    ):

        raise HTTPException(
            status_code=
            status.HTTP_400_BAD_REQUEST,

            detail=
            "O arquivo precisa ser uma imagem."
        )


    # Pega extensão

    extensao = (
        Path(
            imagem.filename
        )
        .suffix
        .lower()
    )


    # Extensões permitidas

    extensoes_permitidas = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ]


    if extensao not in extensoes_permitidas:

        raise HTTPException(
            status_code=
            status.HTTP_400_BAD_REQUEST,

            detail=(
                "Formato não permitido. "
                "Use JPG, JPEG, PNG ou WEBP."
            )
        )


    # Cria nome único

    nome_arquivo = (
        f"{uuid4()}{extensao}"
    )


    # Caminho físico

    caminho_arquivo = (
        PASTA_IMAGENS
        / nome_arquivo
    )


    # Salva arquivo

    with open(
        caminho_arquivo,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            imagem.file,
            buffer
        )


    # Retorna URL da imagem

    return (
        "/static/images/produtos/"
        f"{nome_arquivo}"
    )


# ==============================
# LISTAR PRODUTOS
# ==============================

@router.get(
    "/produtos",
    response_model=
    list[ProdutoResponse]
)

def listar_produtos(

    db: Session =
    Depends(get_db)

):

    produtos = (
        db.query(
            Produto
        )
        .filter(
            Produto.ativo == True
        )
        .order_by(
            Produto.id.desc()
        )
        .all()
    )


    return produtos


# ==============================
# CADASTRAR PRODUTO
# ==============================

@router.post(
    "/produtos",
    response_model=
    ProdutoResponse,

    status_code=
    status.HTTP_201_CREATED
)

def criar_produto(

    nome: str =
    Form(...),

    descricao: str =
    Form(...),

    preco: float =
    Form(...),

    imagem: UploadFile | None =
    File(
        default=None
    ),

    db: Session =
    Depends(get_db)

):


    caminho_imagem = None


    # Se enviou imagem

    if imagem:

        caminho_imagem = (
            salvar_imagem(
                imagem
            )
        )


    novo_produto = Produto(

        nome=nome,

        descricao=descricao,

        preco=preco,

        imagem=caminho_imagem

    )


    db.add(
        novo_produto
    )


    db.commit()


    db.refresh(
        novo_produto
    )


    return novo_produto


# ==============================
# EDITAR PRODUTO
# ==============================

@router.put(
    "/produtos/{produto_id}",
    response_model=
    ProdutoResponse
)

def editar_produto(

    produto_id: int,

    nome: str =
    Form(...),

    descricao: str =
    Form(...),

    preco: float =
    Form(...),

    imagem: UploadFile | None =
    File(
        default=None
    ),

    db: Session =
    Depends(get_db)

):


    produto = (
        db.query(
            Produto
        )
        .filter(
            Produto.id ==
            produto_id
        )
        .first()
    )


    if not produto:

        raise HTTPException(

            status_code=
            status.HTTP_404_NOT_FOUND,

            detail=
            "Produto não encontrado."

        )


    # Atualiza dados

    produto.nome = nome

    produto.descricao = descricao

    produto.preco = preco


    # Troca imagem apenas
    # se uma nova foi enviada

    if imagem:

        produto.imagem = (
            salvar_imagem(
                imagem
            )
        )


    db.commit()


    db.refresh(
        produto
    )


    return produto


# ==============================
# EXCLUIR PRODUTO
# ==============================

@router.delete(
    "/produtos/{produto_id}"
)

def excluir_produto(

    produto_id: int,

    db: Session =
    Depends(get_db)

):


    produto = (
        db.query(
            Produto
        )
        .filter(
            Produto.id ==
            produto_id
        )
        .first()
    )


    if not produto:

        raise HTTPException(

            status_code=
            status.HTTP_404_NOT_FOUND,

            detail=
            "Produto não encontrado."

        )


    # Soft delete

    produto.ativo = False


    db.commit()


    return {

        "message":
        "Produto removido com sucesso."

    }