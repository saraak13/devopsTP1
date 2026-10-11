from flask import Flask, request, jsonify
import joblib
import os

app = Flask(__name__)

# Load the trained model
model_path = os.path.join("models", "iris_model.pkl")
model = joblib.load(model_path)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "Iris MLOps API",
        "status": "running"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Parse incoming JSON payload
        data = request.get_json(force=True)
        features = data["features"]
        
        # Make prediction
        prediction = model.predict([features])
        
        return jsonify({
            "prediction": int(prediction[0])
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)