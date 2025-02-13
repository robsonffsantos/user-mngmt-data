import json
from pymongo import MongoClient
import time
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client.prodDatabase
users_collection = db.users

def import_data():
    with open("D:/Users/Nando/Documentos/Projetos/user-mngmt-data/data/udata.json", "r") as file:
        data = json.load(file)

    if isinstance(data, dict) and "users" in data:
        data = data["users"]

    if not isinstance(data, list):
        print("Erro: O JSON deve conter uma lista de usuários.")
        return

    users = []
    for item in data:
        if not isinstance(item, dict):
            print(f"Erro: item inválido no JSON -> {item}")
            continue

        roles = [role.replace("is_user_", "") for role, value in item.items() if role.startswith("is_user_") and value]

        created_ts = time.time()
        if "created_at" in item:
            try:
                created_ts = datetime.strptime(item["created_at"], "%Y-%m-%dT%H:%M:%SZ").timestamp()
            except ValueError:
                print(f"Erro ao converter data para o usuário {item['user']}")

        users.append({
            "username": item["user"],
            "password": item["password"],
            "roles": roles,
            "preferences": {"timezone": item["user_timezone"]},
            "active": item.get("is_user_active", True),
            "created_ts": created_ts
        })

    if users:
        users_collection.insert_many(users)
        print("Dados importados com sucesso!")
    else:
        print("Nenhum usuário válido para importar.")

if __name__ == "__main__":
    import_data()
