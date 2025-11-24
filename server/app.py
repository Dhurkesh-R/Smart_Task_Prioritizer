import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load model and encoders
model = pickle.load(open("../model/catboost_model.pkl", "rb"))
columns = pickle.load(open("../model/columns.pkl", "rb"))
label_encoder = pickle.load(open("../model/task_type_encoder.pkl", "rb"))  # For task_type

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        # Convert task_type using label encoder
        task_type_encoded = label_encoder.transform([data["task_type"]])[0]

        # One-hot encode deadline_urgency manually
        deadline_categories = [
            "deadline_urgency_No Deadline",
            "deadline_urgency_Overdue",
            "deadline_urgency_This Week",
            "deadline_urgency_Today",
            "deadline_urgency_Tomorrow"
        ]
        deadline_ohe = {cat: 0 for cat in deadline_categories}
        key = f'deadline_urgency_{data["deadline_urgency"]}'
        if key in deadline_ohe:
            deadline_ohe[key] = 1

        # Construct full input dictionary
        input_dict = {
            "task_type": task_type_encoded,
            "duration_minutes": data["duration_minutes"],
            "urgency": data["urgency"],
            "importance_to_goals": data["importance_to_goals"],
            "depends_on_you": data["depends_on_you"],
            "stress_level": data["stress_level"],
            "motivation_level": data["motivation_level"],
            "enjoyment_level": data["enjoyment_level"],
            "task_blocking_others": data["task_blocking_others"],
            **deadline_ohe
        }

        # Ensure all required columns exist
        df = pd.DataFrame([input_dict], columns=columns)

        prediction = model.predict(df)[0]
        return jsonify({"priority": prediction[0]})

    except Exception as e:
        import traceback
        print("Prediction error:", str(e))
        traceback.print_exc()
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

