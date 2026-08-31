from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def criar_hash_senha(senha:str):
    senha_bytes = senha.encode("utf-8")[:72]


    senha_truncada = senha_bytes.decode(
        "utf-8",
        errors="ignore"
    )

    return pwd_context.hash(
        senha_truncada
    )

def verificar_senha(
        senha:str,
        senha_hash:str
):

  senha_bytes = senha.encode("utf-8")[:72] 

  senha_truncada = senha_bytes.decode(
     "utf-8",
     errors ="ignore"
  )

  return pwd_context.verify(
     senha_truncada,
     senha_hash
  )
