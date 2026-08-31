from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from models.produto import Produto
from schemas.produto import ProdutoResponse


router = APIRouter(
    prefix="/produtos",
    tags=["Produtos Públicos"]
)


@router.get(
    "",
    response_model=list[ProdutoResponse]
)
def listar_produtos_publicos(
    db: Session = Depends(get_db)
):
    produtos = (
        db.query(Produto)
        .order_by(Produto.id.desc())
        .all()
    )

    return produtos