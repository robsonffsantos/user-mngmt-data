from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
import time

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo = PyMongo(app)
users_collection = mongo.db.users

def serialize_user(user):
    return {
        "_id": str(user["_id"]),
        "username": user["username"],
        "password": user["password"],
        "roles": user["roles"],
        "timezone": user["preferences"]["timezone"],
        "active": user["active"],
        "created_ts": user["created_ts"]
    }

@app.route("/users", methods=["GET"])
def get_users():
    users = users_collection.find()
    return jsonify([serialize_user(user) for user in users])

@app.route("/users/<id>", methods=["GET"])
def get_user(id):
    user = users_collection.find_one({"_id": ObjectId(id)})
    if user:
        return jsonify(serialize_user(user))
    return jsonify({"error": "Usuário não encontrado"}), 404

@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    user = {
        "username": data["username"],
        "password": data["password"],
        "roles": data["roles"],
        "preferences": {"timezone": data["timezone"]},
        "active": data.get("active", True),
        "created_ts": time.time()
    }
    user_id = users_collection.insert_one(user).inserted_id
    return jsonify({"message": "Usuário criado", "user_id": str(user_id)})

@app.route("/users/<id>", methods=["PUT"])
def update_user(id):
    data = request.json
    updated_user = {
        "username": data["username"],
        "password": data["password"],
        "roles": data["roles"],
        "preferences": {"timezone": data["timezone"]},
        "active": data.get("active", True),
        "created_ts": time.time()
    }
    result = users_collection.update_one({"_id": ObjectId(id)}, {"$set": updated_user})
    if result.modified_count:
        return jsonify({"message": "Usuário atualizado"})
    return jsonify({"error": "Usuário não encontrado"}), 404

@app.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    result = users_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "Usuário excluído"})
    return jsonify({"error": "Usuário não encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True)
