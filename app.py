from flask import Flask, send_from_directory
import os
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def train_volatile_model():
    # 1. Generate synthetic financial/transaction data without a fixed seed
    X, y = make_classification(n_samples=500, n_features=5, random_state=None)
    
    # 2. Split data without a fixed seed
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    # 3. Train a classifier using stochastic gradient descent randomness
    model = SGDClassifier(loss="log_loss")
    model.fit(X_train, y_train)
    
    # 4. Evaluate performance
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"Model trained locally. Accuracy: {accuracy:.4f}")
    return accuracy

if __name__ == "__main__":
    train_volatile_model()

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)