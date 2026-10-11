import pandas as pd
from sklearn.datasets import load_iris

# Load iris dataset into a pandas DataFrame
iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)

# Print statistical summary to analyze potential data drift
print(df.describe())
