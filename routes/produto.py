from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from models.produto import Produto
from schemas.produto import ProdutoResponse


router = APIRouter(
    prefix="/produtos",
    tags=["Produtos"]
)


@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):

    produtos = (
        db.query(Produto)
        .filter(Produto.ativo == True)
        .all()
    )

    return produtos


@router.get("/{produto_id}", response_model=ProdutoResponse)
def buscar_produto(
    produto_id: int,
    db: Session = Depends(get_db)
):

    produto = (
        db.query(Produto)
        .filter(Produto.id == produto_id)
        .filter(Produto.ativo == True)
        .first()
    )

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )

    return produto