import os
from datetime import datetime, timedelta, timezone

from jose import jwt


# Chave secreta usada para assinar os tokens
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "chave-apenas-para-desenvolvimento"
)

# Algoritmo utilizado para assinar o JWT
ALGORITHM = "HS256"

# Tempo de validade do token
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def criar_access_token(dados: dict):
    dados_token = dados.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    dados_token.update({
        "exp": expire
    })

    token = jwt.encode(
        dados_token,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token
