from sqlalchemy import Column, Integer, String, Float, Boolean

from database.connection import Base


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)

    descricao = Column(String, nullable=False)

    preco = Column(Float, nullable=False)

    imagem = Column(String, nullable=True)

    ativo = Column(Boolean, default=True)