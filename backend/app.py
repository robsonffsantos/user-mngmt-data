from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import datetime

app = Flask(__name__)

CORS(app, origins=["http://localhost:8080"])

client = MongoClient("mongodb://localhost:27017/")
db = client.prodDatabase
users_collection = db.users

def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "roles": user["roles"],
        "timezone": user["preferences"]["timezone"],
        "active": user["active"],
        "created_at": user["created_ts"],
        "updated_at": user.get("updated_at", user["created_ts"])
    }

@app.route("/users", methods=["GET"])
def get_users():
    users = list(users_collection.find({}))
    return jsonify([serialize_user(user) for user in users])

@app.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(serialize_user(user))

@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    new_user = {
        "username": data["username"],
        "password": data["password"],
        "roles": data["roles"],
        "preferences": {"timezone": data["timezone"]},
        "active": data.get("active", True),
        "created_ts": datetime.datetime.utcnow().timestamp(),
        "updated_at": datetime.datetime.utcnow().timestamp(),
    }
    result = users_collection.insert_one(new_user)
    return jsonify({"message": "User created", "id": str(result.inserted_id)}), 201

@app.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    update_fields = {
        "username": data["username"],
        "roles": data["roles"],
        "preferences": {"timezone": data["timezone"]},
        "active": data["active"],
        "updated_at": datetime.datetime.utcnow().timestamp(),
    }
    result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
    
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "User updated"})

@app.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    
    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "User deleted"})

if __name__ == "__main__":
    app.run(debug=True)
