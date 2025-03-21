# api/services/translation.py
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch
from django.conf import settings

class IndicTranslationService:
    def __init__(self):
        # Load the IndicTrans2 model and tokenizer
        self.model_name = settings.INDIC_TRANS_MODEL_PATH
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Initialize the model and tokenizer (lazy loading)
        self._model = None
        self._tokenizer = None
    
    @property
    def model(self):
        if self._model is None:
            self._model = AutoModelForSeq2SeqLM.from_pretrained(
                self.model_name
            ).to(self.device)
        return self._model
    
    @property
    def tokenizer(self):
        if self._tokenizer is None:
            self._tokenizer = AutoTokenizer.from_pretrained(
                self.model_name
            )
        return self._tokenizer
    
    def translate(self, text, source_lang, target_lang="en"):
        """
        Translate text using IndicTrans2
        
        Parameters:
        text (str): The text to translate
        source_lang (str): Source language code
        target_lang (str): Target language code, default is English
        
        Returns:
        str: Translated text
        """
        try:
            # Skip translation if source and target are the same
            if source_lang == target_lang:
                return text
            
            # Format the input for IndicTrans2
            if target_lang == "en":
                # Indic to English
                inputs = self.tokenizer(f"{source_lang}>>{text}", return_tensors="pt").to(self.device)
            else:
                # English to Indic
                inputs = self.tokenizer(f"en>>{target_lang}>>{text}", return_tensors="pt").to(self.device)
            
            # Generate translation
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_length=2048,
                    num_beams=5,
                    num_return_sequences=1
                )
            
            # Decode and return the translation
            translation = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return translation
            
        except Exception as e:
            print(f"Error during translation: {e}")
            return text
