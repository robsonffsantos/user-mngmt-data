import json
import datetime
from pymongo import MongoClient
from models import User, UserPreferences

client = MongoClient("mongodb://localhost:27017/")
db = client.prodDatabase
users_collection = db.users

with open("../data/users.json", "r") as file:
    users_data = json.load(file)

users = []
for user in users_data:
    preferences = UserPreferences(timezone=user["preferences"]["timezone"])
    new_user = User(
        username=user["username"],
        password=user["password"],
        roles=user["roles"],
        preferences=preferences,
        active=user.get("active", True),
        created_ts=datetime.datetime.utcnow().timestamp()
    )
    users.append(new_user.__dict__)

users_collection.insert_many(users)
print("Data imported successfully!")

