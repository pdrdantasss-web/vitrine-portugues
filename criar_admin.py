from database.connection import SessionLocal
from models.admin import Admin
from security.security import criar_hash_senha

email = input("Digite o email do admin: ").strip()
senha = input("Digite a senha do admin: ")

db = SessionLocal()

admin_existente = db.query(Admin).filter(
Admin.email == email
).first()

if admin_existente:
 print("Esse admin já existe!")

else:
   senha_hash = criar_hash_senha(senha)


novo_admin = Admin(
    email=email,
    senha_hash=senha_hash
)

db.add(novo_admin)
db.commit()

print("Admin criado com sucesso!")
print("Email:", email)


db.close()
