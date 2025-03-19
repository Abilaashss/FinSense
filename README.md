# FinSense :rocket:

# Demonstration Video - https://youtu.be/X5pfqrTf0rA

https://github.com/user-attachments/assets/5a3b3c37-03b9-471a-8747-a22245a6357d

## Have a look at the sample AI Branch Manager Video below : 




https://github.com/user-attachments/assets/bf55eb94-13b4-438f-abdf-cdd577abc670




<details>
  <summary>Table of Contents</summary>

1. [Introduction](#introduction)
2. [Globalised JSON Schema](#globalised-json-schema)
    - [Sample Inference](#sample-inference)
3. [Model Architecture](#model-architecture)
   - [Approach-1](#approach-1)
   - [Approach-2](#approach-2)
4. [Accuracy Metrics](#accuracy-metrics)
5. [Accuracy Estimation Method](#accuracy-estimation-method)
6. [Datasets](#datasets)
   - [Test Dataset](#test-dataset)
   - [Train Dataset](#train-dataset)
7. [Hyperparameters and AutoML Tuning](#hyperparameters-and-automl-tuning)
8. [Technical Requirements](#technical-requirements)
   - [Hardware Requirements](#hardware-requirements)
   - [Software Requirements](#software-requirements)
   - [Required Libraries](#required-libraries)
   - [Installation and Setup](#installation-and-setup)
9. [Code Snippets](#code-snippets)
   - [Running on Linux](#running-on-linux)
   - [Running on macOS](#running-on-macos)
   - [Running on Windows](#running-on-windows)
10. [Internal Architecture Changes with MLP Head](#internal-architecture-changes-with-mlp-head)
11. [Conclusion](#conclusion)
12. [Contributors](#contributors)

</details>

---

## Introduction




https://github.com/user-attachments/assets/dcc220c2-9ddf-4cc3-bf59-c20cf270f5fe


# FinSense Application

## Overview

**FinSense** is a cutting-edge application designed to streamline the Loan application and verification process using Optical Character Recognition (OCR) and AI Agents that follows rule-based approval system. This application leverages advanced technologies to assist users in applying for loans just by allowing them to take a video instead of filling lengthy forms ! 

## Dont feel comfortable answering in English ? Dont worry !! We got you covered 

**Translation & Transcription**: We use OpenAI Whisper and IndicWave2Vec for accurate speech-to-text conversion. Tamil transcripts are first generated and then translated into English for further processing.

**Text Translation**: We leverage IndicTrans2 to convert Tamil transcripts into English before processing.

**LLM for AI Agent & Q&A Mapping**: Our system is powered by LLaMA-3.2-70B, which enables intelligent agent interactions and precise question-answer mapping.
### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **Python**: Ensure you have Python 3.6 or higher installed. You can download it from [python.org](https://www.python.org/).
- **Git**: Make sure Git is installed. You can download it from [git-scm.com](https://git-scm.com/).

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Abilaashss/FinSense.git
   cd FinSense
   ```

2. **Install Node.js Dependencies**:

   ```bash
   npm install
   ```

3. **Install Python Dependencies**:

   Navigate to the `Document-Identifier` directory and install the required Python packages:

   ```bash
   cd Document-Identifier
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the Next.js Development Server**:

   From the root directory of the project, run:

   ```bash
   npm run dev
   ```



The **OCR Document Classifier** is designed to recognize and extract structured data from various identification documents, including PAN cards, Aadhaar cards, Passports, and Driving Licenses. The model leverages state-of-the-art image recognition, text extraction, and natural language processing techniques to convert document images into a structured **JSON** format.

The classifier uses deep learning models such as **CRAFT** for text segmentation, **TrOCR** and **Florence-2-large** for text extraction, and **LLaMA-3B** for parsing and structuring the extracted text into a JSON schema. This document outlines the full architecture, accuracy metrics, datasets used, system requirements, and code snippets for running on various operating systems.

---

## Globalised JSON Schema

The following schema is used to define the output structure for any document processed by the OCR classifier:

```json
{
    "document_type": "Type of the document (PAN/Aadhar/Passport/Driving)",
    "document_id": "Aadhar number/PAN Number/Driving License PIN/other (null otherwise)",
    "name": "Name of the Person (null otherwise)",
    "dob": "Date of Birth of the given person (DD/MM/YY format) (null otherwise)",
    "gender": "Gender of the Person (M/F) (null otherwise)",
    "address": "Address of the person (null otherwise)",
    "mobile": "Mobile Number/Phone Number of the person (null otherwise)",
    "doi": "Date of Issue of the document (DD/MM/YY format) (null otherwise)",
    "doe": "Date of Expiry of the document (DD/MM/YY format) (null otherwise)",
    "place_of_issue": "Place of Issue of the document (null otherwise)"
}
```

### Sample Inference

Input Image:


[<img src="https://github.com/Ebullioscopic/OCR-Document-Classifier/blob/main/images/sample.png?raw=true" width="400">](https://github.com/Ebullioscopic/OCR-Document-Classifier/blob/main/images/sample.png?raw=true)

Intermediate Output:


[<img src="https://github.com/Ebullioscopic/OCR-Document-Classifier/blob/main/images/inference-output.png?raw=true" width="400">](https://github.com/Ebullioscopic/OCR-Document-Classifier/blob/main/images/inference-output.png?raw=true)

OCR Output:
```json
{'<OCR>': 'भारती संस्कीर-GOVERNMENT OF INDIA-मिलेस रहिNilesh SinghSAMPLEजनम शिूरी / DOB : 01/08/1985पुकर Male4444 3333 2222आधाय - आप अादमी | का अधि को'}
```

Structured JSON Output:
```json
{
    "document_type": "Aadhar",
    "document_id": "4444 3333 2222",
    "name": "Nilesh Singh",
    "dob": "01/08/1985",
    "gender": "M",
    "address": null,
    "mobile": null,
    "doi": null,
    "doe": null,
    "place_of_issue": null
}
```

---

## Model Architecture

### Approach-1: CRAFT + TrOCR + LLaMA-3B

- **Input**: Document Image (e.g., Aadhaar card, PAN card)
- **Process**:
  1. **CRAFT**: Splits the image into individual text lines.
  2. **TrOCR**: Converts line segments into words.
  3. **LLaMA-3B**: Maps the extracted words to the JSON schema.
  
- **Estimated Accuracy**: 95.71%
- **Memory Usage**:
  - **MacBook M3 Max**: 18GB
  - **Nvidia DGX A100**: 20GB

#### Architecture Flow:
```plaintext
(Document Image) -> CRAFT (Single line splits) -> TrOCR (Splits-2-Words) -> LLaMA-3B (Words-2-JSON)
```

---

### Approach-2: Florence-2-large + LLaMA-3B

- **Input**: Document Image
- **Process**:
  1. **Florence-2-large**: Extracts words directly from the document image.
  2. **LLaMA-3B**: Converts extracted words into the JSON schema.
  
- **Estimated Accuracy**: 98.36%
- **Memory Usage**:
  - **MacBook M3 Max**: 18GB (with 10GB swap)
  - **Nvidia DGX A100**: 30GB

#### Architecture Flow:
```plaintext
(Document Image) -> Florence-2-large (Words) -> LLaMA-3B (JSON)
```

---

## Accuracy Metrics

We use **Embedding Score** to measure the similarity between the predicted JSON and the ground truth JSON. Higher similarity between embeddings reflects better accuracy in extracting and structuring document information.

- **Embedding Score Rationale**:
  - Text embeddings from the predicted and ground truth JSON are compared using cosine similarity.
  - The final metric is computed by averaging similarity scores across the dataset.

- **Additional Metrics**:
  - **Precision**, **Recall**, and **F1-Score** indirectly benefit from improved embedding scores, especially for critical fields like `document_id`, `dob`, and `name`.

---

## Accuracy Estimation Method

**Sentence Transformers** are used to compute embeddings for the predicted JSON and ground truth JSON. The method ensures a fine-grained similarity comparison.

- **Steps**:
  1. Convert both JSONs into embedding vectors.
  2. Calculate the cosine similarity between the embeddings.
  3. Compute the average similarity score across the dataset.

---

## Datasets

### Test Dataset

The test dataset is provided by **Roboflow**, and includes images of Aadhaar cards for evaluating the OCR model's ability to extract key fields such as Aadhaar number, name, and date of birth.

- **Dataset Link**: [Aadhaar Card Detection Dataset](https://universe.roboflow.com/appinsource-v5mmj/aadhar-card-detection-nfk6r/dataset/)

### Train Dataset

No explicit training dataset is required since hyperparameters have been tuned through **AutoML**. However, during pre-training, the model was fine-tuned on both synthetic and real-world document data.

- **Data Sources**:
  - **Synthetic Document Generation**: Thousands of images with variations in format, font, and layout.
  - **Public Government Document Datasets**: Aadhaar, PAN, passport, and driving license documents for pre-training.

---

## Hyperparameters and AutoML Tuning

### Hyperparameters

- **Batch Size**: 16
- **Learning Rate**: 3e-5
- **Optimizer**: AdamW
- **Warmup Steps**: 500
- **Number of Epochs**: 10
- **Max Sequence Length**: 256

### AutoML Tuning

AutoML was used to fine-tune these hyperparameters through techniques like grid search and random search. The pipeline automatically optimized:

- **Learning Rate Scheduling**: Dynamic adjustments based on performance.
- **Data Augmentation**: Simulated variations such as noise and distortion.
- **Early Stopping**: Prevented overfitting.

---

## Technical Requirements

### Hardware Requirements

- **MacBook M3 Max**: 18GB RAM (10GB swap for Approach-2)
- **Nvidia DGX A100**: 20GB (Approach-1) or 30GB (Approach-2)

### Software Requirements

- **Python**: 3.8+
- **CUDA**: 11+ (for GPU acceleration)

---

### Required Libraries

Install the necessary libraries:

```bash
pip install torch transformers sentence-transformers opencv-python
pip install git+https://github.com/clovaai/CRAFT-pytorch.git
pip install florence-transformers
```

---

## Installation and Setup

### Running on Linux

```bash
# Clone the repository
git

 clone https://github.com/your-repo/ocr-document-classifier.git
cd ocr-document-classifier

# Install dependencies
pip install -r requirements.txt

# Run the model
python run_model.py --image_path path/to/image --approach 1  # For Approach-1
python run_model.py --image_path path/to/image --approach 2  # For Approach-2
```

### Running on macOS

```bash
# Install Homebrew (if not installed)
brew install python3

# Install dependencies
pip3 install -r requirements.txt

# Run the model
python3 run_model.py --image_path path/to/image --approach 1
```

### Running on Windows

```bash
# Ensure Python and pip are installed
python --version
pip --version

# Install dependencies
pip install -r requirements.txt

# Run the model
python run_model.py --image_path path/to/image --approach 2
```

---

## Internal Architecture Changes with MLP Head

### Overview of Transformer-Based Architecture

In both Approach-1 and Approach-2, we have incorporated an **MLP (Multi-Layer Perceptron) head** after the Transformer layers to refine the text embeddings extracted by the OCR models. This adjustment significantly enhances the accuracy and structural representation of the JSON outputs, especially for unstructured and noisy document data.

### Transformer Layer Composition

Let’s delve into the architecture changes:

## 1. **Transformer Layers**

Both **TrOCR** and **Florence-2-large** use **Transformer blocks** that rely on **multi-head self-attention** (MHSA) and **feed-forward neural networks** (FFN). These blocks are critical for processing input sequences in parallel and learning dependencies between words or characters.

### **Attention Mechanism**:

The **self-attention mechanism** in each Transformer block operates as follows:

```math
\text{Attention}(Q, K, V) = \text{softmax} \left( \frac{QK^\top}{\sqrt{d_k}} \right) V
```

Where:
- $Q = XW_Q$ (the **query matrix**),
- $K = XW_K$ (the **key matrix**),
- $V = XW_V$ (the **value matrix**),
- $W_Q, W_K, W_V$ are learnable parameter matrices,
- $d_k$ is the dimensionality of the key vectors.

This mechanism computes a weighted sum of values $V$, where the weights are determined by the dot products between queries and keys, scaled by $\frac{1}{\sqrt{d_k}}$ to prevent large gradients.

### **Multi-Head Self-Attention (MHSA)**:

In **multi-head attention**, instead of using a single attention function, multiple attention heads are computed in parallel. Each head uses different linear projections of $Q$, $K$, and $V$:

```math
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \text{head}_2, \dots, \text{head}_h) W_O
```

Where:
- ${head}_i = {Attention}(QW_{Q_i}, KW_{K_i}, VW_{V_i})$,
- $W_{Q_i}, W_{K_i}, W_{V_i}$ are projection matrices for each head $i$,
- $W_O$ is the final output projection matrix.

Each attention head focuses on different parts of the input sequence, allowing the model to capture more nuanced relationships between words.

### **Feed-Forward Neural Networks (FFN)**:

Each Transformer block contains a **position-wise feed-forward network** applied independently to each position:

```math
\text{FFN}(x) = \text{GELU}(xW_1 + b_1)W_2 + b_2
```

Where:
- $W_1 \in \mathbb{R}^{d_{\text{model}} \times d_{\text{ff}}}$,
- $W_2 \in \mathbb{R}^{d_{\text{ff}} \times d_{\text{model}}}$,
- $d_{\text{model}}$ is the dimensionality of the model,
- $d_{\text{ff}}$ is the dimensionality of the intermediate feed-forward layer (usually much larger than $d_{\text{model}}$),
- $b_1$ and $b_2$ are biases, and the **GELU** function introduces non-linearity.

### **Layer Normalization**:

After each sub-layer (self-attention and feed-forward), **Layer Normalization** is applied:

```math
\text{LayerNorm}(x) = \frac{x - \mu}{\sigma + \epsilon}
```

Where:
- $\mu$ is the mean of the input,
- $\sigma$ is the standard deviation, and
- $\epsilon$ is a small constant to avoid division by zero.

This normalization stabilizes the training process and accelerates convergence.

## 2. **MLP Head**

After passing through the transformer layers, the output is fine-tuned using a **Multi-Layer Perceptron (MLP) head**. The MLP head performs task-specific transformations, mapping the output embeddings to the structured **JSON schema fields** (e.g., `document_id`, `name`, `dob`).

### **MLP Architecture**:

The MLP consists of multiple fully-connected layers with non-linear activations:

```math
\text{MLP}(x) = \sigma(W_2 \cdot \text{ReLU}(W_1 \cdot x + b_1) + b_2)
```

Where:
- $x \in \mathbb{R}^{d_{\text{model}}}$ is the input embedding from the final transformer layer,
- $W_1 \in \mathbb{R}^{d_{\text{model}} \times d_{\text{hidden}}}$ and $W_2 \in \mathbb{R}^{d_{\text{hidden}} \times d_{\text{output}}}$ are weight matrices,
- $b_1 \in \mathbb{R}^{d_{\text{hidden}}}$ and $b_2 \in \mathbb{R}^{d_{\text{output}}}$ are biases,
- $d_{\text{hidden}}$ is the dimensionality of the hidden layer,
- $d_{\text{output}}$ is the dimensionality of the output space (number of JSON fields),
- $\sigma$ is an activation function, often **ReLU** or **GELU**.

### **Advanced MLP Modifications**:

In this architecture, we introduce **Layer Normalization** and **Dropout** for regularization and faster convergence:

```math
\text{MLP}(x) = \text{Dropout}(\sigma(\text{LayerNorm}(W_2 \cdot \text{ReLU}(W_1 \cdot x + b_1) + b_2)))
```

Where:
- **Dropout** helps to prevent overfitting by randomly setting a fraction of the activations to zero during training.
- **LayerNorm** normalizes the hidden states to stabilize learning.

### **Final Mapping**:

The final layer of the MLP head transforms the hidden representations into the required JSON fields. These transformations allow the model to map the document information (text embeddings) to specific labels (e.g., `document_id`, `dob`, etc.).

## 3. **Transformer with MLP Head Calculation Overview**

### **Self-Attention Complexity**:

The complexity of the attention mechanism is $O(n^2 \cdot d_{\text{model}})$, where:
- $n$ is the sequence length (number of tokens),
- $d_{\text{model}}$ is the embedding dimension.

To improve efficiency, techniques like **Sparse Attention** or **Local Attention** could be used, but in this architecture, we rely on the full attention mechanism for maximum accuracy.

### **MLP Complexity**:

The computational complexity of the **MLP head** is:

```math
O(n \cdot d_{\text{model}} \cdot d_{\text{hidden}} + n \cdot d_{\text{hidden}} \cdot d_{\text{output}})
```

Where:
- $n$ is the number of tokens,
- $d_{\text{model}}$ is the model's dimensionality,
- $d_{\text{hidden}}$ is the hidden layer size, typically larger than $d_{\text{model}}$,
- $d_{\text{output}}$ is the number of output classes (in this case, the JSON fields).

## 4. **Enhancements and Changes in Internal Architecture**

### **Multi-Layer Perceptron Head with Cross-Attention**:

We've incorporated **cross-attention layers** in the MLP head for tasks requiring interactions between different document fields. The cross-attention mechanism computes dependencies across different embeddings before final classification.

For the cross-attention:

```math
\text{Cross-Attention}(Q, K, V) = \text{softmax}\left( \frac{QK^\top}{\sqrt{d_k}} \right) V
```

This ensures fields like `document_id` and `dob` can interact, improving the model's understanding of document structure.


### Memory Considerations with MLP

- **Memory Usage**: The addition of the MLP head increases memory consumption slightly, but the improved accuracy compensates for this.
   - On **DGX A100** (Nvidia), we observe a memory increase from 20GB to 22GB for Approach-1 and from 30GB to 33GB for Approach-2.
  
- **Performance Gains**: The embedding accuracy increases by ~1.5%, notably improving field extraction in noisy images, particularly for long address fields and complex date formats.

---

## Contributors
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Ebullioscopic">
        <img src="https://github.com/Ebullioscopic.png" width="60" height="60" style="border-radius: 50%;" alt="Ebullioscopic GitHub"/>
      </a>
      <br />
      <a href="https://github.com/Ebullioscopic">Hariharan Mudaliar</a>
    </td>
    <td align="center">
      <a href="https://github.com/umeshgjh">
        <img src="https://github.com/umeshgjh.png" width="60" height="60" style="border-radius: 50%;" alt="umeshgjh GitHub"/>
      </a>
      <br />
      <a href="https://github.com/umeshgjh">Umesh G J H</a>
    </td>
    <td align="center">
      <a href="https://github.com/Abilaashss">
        <img src="https://github.com/Abilaashss.png" width="60" height="60" style="border-radius: 50%;" alt="Abilaashss GitHub"/>
      </a>
      <br />
      <a href="https://github.com/Abilaashss">Abilaash S S</a>
    </td>
    <td align="center">
      <a href="https://github.com/Kavya-Udhayashankar">
        <img src="https://github.com/Kavya-Udhayashankar.png" width="60" height="60" style="border-radius: 50%;" alt="Kavya-Udhayashankar GitHub"/>
      </a>
      <br />
      <a href="https://github.com/Kavya-Udhayashankar">Kavya Udhayashankar</a>
    </td>
    <td align="center">
      <a href="https://github.com/arvindkumar1422">
        <img src="https://github.com/arvindkumar1422.png" width="60" height="60" style="border-radius: 50%;" alt="arvindkumar1422 GitHub"/>
      </a>
      <br />
      <a href="https://github.com/arvindkumar1422">Arvind Kumar</a>
    </td>
  </tr>
</table>

