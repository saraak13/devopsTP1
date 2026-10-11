import joblib
from sklearn.datasets import load_iris

# 1. Load the saved model
model = joblib.load("models/iris_model.pkl")

# 2. Load the dataset
iris = load_iris()

# 3. Take a sample for prediction (e.g., the first sample in the dataset)
sample = [iris.data[0]]

# 4. Predict the class
prediction = model.predict(sample)

print("Classe index :", prediction[0])
print("Nom de la classe :", iris.target_names[prediction[0]])