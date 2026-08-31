from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.connection import get_db
from models.admin import Admin
from schemas.admin import AdminLogin
from security.security import verificar_senha
from security.jwt import criar_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"]
)


@router.post("/login")
def login(
    dados: AdminLogin,
    db: Session = Depends(get_db)
):

    admin = (
        db.query(Admin)
        .filter(Admin.email == dados.email)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    senha_correta = verificar_senha(
        dados.senha,
        admin.senha_hash
    )

    if not senha_correta:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    access_token = criar_access_token(
        {
            "sub": admin.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }