from pydantic import BaseModel


class ProdutoCreate(BaseModel):

    nome: str
    descricao: str
    preco: float
    imagem: str | None = None


class ProdutoUpdate(BaseModel):

    nome: str | None = None
    descricao: str | None = None
    preco: float | None = None
    imagem: str | None = None
    ativo: bool | None = None


class ProdutoResponse(BaseModel):

    id: int
    nome: str
    descricao: str
    preco: float
    imagem: str | None
    ativo: bool

    class Config:
        from_attributes = True