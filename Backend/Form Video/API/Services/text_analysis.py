# api/services/text_analysis.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import json
from django.conf import settings

class LlamaAnalysisService:
    def __init__(self):
        # Load the Llama 3.2 model and tokenizer
        self.model_name = settings.LLAMA_MODEL_PATH
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Initialize the model and tokenizer (lazy loading)
        self._model = None
        self._tokenizer = None
    
    @property
    def model(self):
        if self._model is None:
            self._model = AutoModelForCausalLM.from_pretrained(
                self.model_name, 
                torch_dtype=torch.float16,
                device_map="auto"
            )
        return self._model
    
    @property
    def tokenizer(self):
        if self._tokenizer is None:
            self._tokenizer = AutoTokenizer.from_pretrained(
                self.model_name
            )
        return self._tokenizer
    
    def extract_form_data(self, transcript, form_schema=None):
        """
        Analyze transcript and extract form data using Llama 3.2
        
        Parameters:
        transcript (str): The transcript text
        form_schema (dict, optional): Schema defining the form fields
        
        Returns:
        dict: Extracted form data in JSON format
        """
        try:
            # Default form schema if none provided
            if form_schema is None:
                form_schema = {
                    "name": "string",
                    "email": "string",
                    "phone": "string",
                    "address": "string",
                    "reason_for_application": "string",
                    "additional_notes": "string"
                }
            
            # Create prompt for Llama
            schema_json = json.dumps(form_schema, indent=2)
            prompt = f"""
            You are a form-filling assistant. Extract the following information from this transcript and format it as JSON:
            
            Form Fields: {schema_json}
            
            Transcript: "{transcript}"
            
            Please extract all the information according to the provided schema and return ONLY a valid JSON object with the extracted data. If a field is not found in the transcript, leave it empty or null.
            """
            
            # Generate completion
            inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=1024,
                    temperature=0.1,
                    do_sample=False
                )
            
            # Decode the response and extract JSON
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract JSON part from the response
            try:
                # Find JSON-like content
                json_start = response.find('{')
                json_end = response.rfind('}') + 1
                if json_start != -1 and json_end != -1:
                    json_str = response[json_start:json_end]
                    form_data = json.loads(json_str)
                else:
                    # Fallback: attempt to parse entire response
                    form_data = json.loads(response)
                
                return form_data
            except json.JSONDecodeError:
                # In case JSON parsing fails, return a structured error response
                print(f"Failed to parse JSON from model response: {response}")
                return {"error": "Failed to extract form data", "raw_response": response}
            
        except Exception as e:
            print(f"Error during form data extraction: {e}")
            raise
