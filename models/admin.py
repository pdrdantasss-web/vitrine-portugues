from sqlalchemy import Column, Integer, String

from database.connection import Base


class Admin(Base):

    __tablename__ = "admins"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    senha_hash = Column(
        String,
        nullable=False
    )