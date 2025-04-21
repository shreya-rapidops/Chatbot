from flask import Flask, request, jsonify
from assistant import get_response_from_command
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    command = data.get("command", "")
    print(f"🧠 Received: {command}")
    reply = get_response_from_command(command)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    print("✅ Flask backend is running at http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
