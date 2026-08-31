from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from security.jwt import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(
tokenUrl="/auth/login"
)

def get_current_admin(
token: str = Depends(oauth2_scheme)
):


    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="nao foi possivel validar as crendenciais"
    )


    try:


        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        email = payload.get("sub")


        if email is None:
            raise credential_exception


        return email


    except JWTError:
        raise credential_exception





        