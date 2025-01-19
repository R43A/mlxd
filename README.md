# `@codnx/mlxd`

**MLXD (Machine Learning eXperiment Deployment)** is a CI/CD testing tool for machine learning workflows. This CLI simplifies testing, configuration, and encryption of ML model performance metrics in a secure and standalone manner.

---

## **Features**

- **Run ML Tests**: Evaluate metrics such as accuracy, precision, and recall for ML models.
- **Fully Configurable**: Easily define model paths, datasets, and test criteria using a `config.yaml` file.

---

## **Quick Start**

### **1. Installation**

Install the CLI globally via npm:

```bash
npm install -g @codnx/mlxd
```

---

### **2. Initialize Configuration**

Run the following command to create a `config.yaml` file in the current directory:

```bash
mlxd init
```

---

### **3. Configure `config.yaml`**

Edit the generated `config.yaml` file to specify your model and dataset paths, along with the test criteria. Example:

```yaml
dataPath: "./data/dataset.csv"
tests:
  - name: "Accuracy Test"
    type: "metric_threshold"
    metric: "accuracy"
    threshold: 0.9
```

---

### **4. Run Tests**

Run the tests defined in the configuration file:

```bash
mlxd run
```

Results will be displayed in the console.

---

## **Commands**

### **Initialization**

- **`mlxd init`**:  
  Creates a `config.yaml` template in the current directory.

### **Run Tests**

- **`mlxd run`**:  
  Executes the tests defined in `config.yaml`.

### **Version**

- **`mlxd --version` or `mlxd -v`**:  
  Displays the current version of the CLI.

### **Uninstall**

- **`mlxd uninstall`**:  
  Removes the CLI from your system.

---

## **Example Workflow**

1. **Install the CLI**:

   ```bash
   npm install -g @codnx/mlxd
   ```

2. **Create a Configuration File**:

   ```bash
   mlxd init
   ```

3. **Edit `config.yaml`**:

   ```yaml
   dataPath: "./data/dataset.csv"
   tests:
     - name: "Accuracy Test"
       type: "metric_threshold"
       metric: "accuracy"
       threshold: 0.9
   ```

4. **Run Tests**:

   ```bash
   mlxd run
   ```

5. **Uninstall the CLI**:

   ```bash
   mlxd uninstall
   ```

---

## **Troubleshooting**

### **Common Issues**

- **No `config.yaml` found**:  
  Ensure you run `mlxd init` to generate the configuration file.

- **Model or dataset file not found**:  
  Verify that the paths in `config.yaml` (`modelPath` and `dataPath`) point to valid files.

---

### **Check CLI Version**

Confirm the installed version using:

```bash
mlxd --version
```

---

## **Contact Support**

If you encounter issues or have questions, feel free to reach out to our support team:

- **Email**: [support@codin.in](mailto:support@codin.in)

We’re here to help!

---

## **License**

This project is licensed under the Apache License 2.0.

---

## **Usage Agreement**

By installing or using the `@codin/mlxd` CLI tool, you acknowledge and agree to the following terms:

### **1. Development Status**

- This CLI tool is under active development and may undergo significant changes in functionality, structure, and features.
- The current version provides limited functionality (Automated model performance checks) and may include experimental or unstable features.

### **2. Usage Terms**

- You are permitted to use this CLI tool solely for its intended purpose: testing machine learning models within your projects.
- Redistribution, reverse engineering, or modification of the tool for commercial purposes without explicit permission from the authors is prohibited.
- You are responsible for any actions or consequences arising from the use of this CLI tool, including but not limited to data handling and processing.

### **3. Data Responsibility**

- This CLI does not transmit or store any user data externally. However, you are responsible for ensuring the security and confidentiality of the datasets, models, and configuration files (`config.yaml`) used with the CLI.
- It is your responsibility to comply with applicable data privacy, security, and governance laws while using this tool.

### **4. Disclaimer of Warranty**

- This CLI is provided on an "as-is" basis, without any guarantees or warranties, express or implied, including but not limited to fitness for a particular purpose, non-infringement, or merchantability.
- The authors make no guarantee that the tool is free of errors, bugs, or vulnerabilities.

### **5. Limitation of Liability**

- The authors and contributors shall not be held liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the CLI, even if advised of the possibility of such damages.

### **6. Updates and Changes**

- The tool may be updated frequently during development. These updates may alter or remove features without prior notice.
- Users are encouraged to keep the CLI updated to ensure compatibility and access to the latest improvements.

### **7. Feedback and Contributions**

- By providing feedback, suggestions, or contributions to the project, you grant the authors a non-exclusive, royalty-free, worldwide license to use, modify, and distribute your contributions as part of the project.

### **8. Termination of Use**

- The authors reserve the right to revoke access to this CLI tool at any time if the terms of this agreement are violated.

### **9. Governing License**

- This tool is licensed under the [ISC License](./LICENSE). The terms of the ISC License apply in addition to this Usage Agreement.

---
