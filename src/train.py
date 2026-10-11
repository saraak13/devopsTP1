from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import mlflow
import mlflow.sklearn
import joblib
import os

mlflow.set_experiment("Iris_MLOps")

iris = load_iris()
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Test multiple n_estimators values as required by the TP
for n_est in [50, 100, 200]:
    with mlflow.start_run():
        model = RandomForestClassifier(n_estimators=n_est, random_state=42)
        model.fit(X_train, y_train)
        
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        
        mlflow.log_param("n_estimators", n_est)
        mlflow.log_param("test_size", 0.2)
        mlflow.log_metric("accuracy", accuracy)
        mlflow.sklearn.log_model(
            model, 
            "model", 
            skops_trusted_types=["sklearn.tree._tree.Tree"]
        )
        
        print(f"n_estimators: {n_est} -> Accuracy: {accuracy}")

# Save the final model locally
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/iris_model.pkl")
print("Modèle sauvegardé.")