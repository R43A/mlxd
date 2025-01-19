#!/usr/bin/env python3
import sys
import json
import numpy as np
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error

# Optional: import real ML libraries
# from transformers import AutoModelForSequenceClassification, AutoTokenizer
# import torch


def load_dataset(data_path: str):
    # Replace this logic to load an actual dataset (CSV, JSON, etc.)
    # Here, we're just simulating random predictions & labels for demo purposes.
    preds = np.random.randint(0, 2, 100)
    labels = np.random.randint(0, 2, 100)
    return preds, labels


def validate_dataset(preds, labels):
    # Example: Check if we got enough samples or if data is empty.
    if len(preds) == 0 or len(labels) == 0:
        return False, "No data found for predictions or labels."
    if len(preds) != len(labels):
        return False, "Predictions and labels have different lengths."
    return True, ""


def load_model(model_path: str):
    # In a real scenario, load your ML model here (e.g., GPT-Neo, BERT).
    # Example (commented out):
    # model = AutoModelForSequenceClassification.from_pretrained(model_path)
    # tokenizer = AutoTokenizer.from_pretrained(model_path)
    return None


def main():
    # CLI arguments:
    # 1) Metric name (e.g., "accuracy", "f1", "rmse").
    # 2) Optional dataset path (default: "my_real_dataset.csv").
    # 3) Optional model path (default: None).
    metric_name = sys.argv[1] if len(sys.argv) > 1 else "accuracy"
    data_path = sys.argv[2] if len(sys.argv) > 2 else "my_real_dataset.csv"
    model_path = sys.argv[3] if len(sys.argv) > 3 else None

    # Load data (predictions & labels) and validate.
    preds, labels = load_dataset(data_path)
    passed, message = validate_dataset(preds, labels)
    if not passed:
        print(json.dumps({"error": f"Data validation failed: {message}"}))
        sys.exit(1)

    # Load the model if needed (inference logic not shown in this sample).
    model = load_model(model_path)

    # Calculate the requested metric.
    if metric_name == "accuracy":
        value = accuracy_score(labels, preds)
    elif metric_name == "f1":
        value = f1_score(labels, preds)
    elif metric_name == "rmse":
        value = mean_squared_error(labels, preds, squared=False)
    else:
        value = 0.0

    # Output metric as JSON for the CLI to parse.
    print(json.dumps({"metric": metric_name, "value": float(value)}))


if __name__ == "__main__":
    main()
