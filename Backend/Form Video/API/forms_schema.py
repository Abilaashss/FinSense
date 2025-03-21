# api/forms_schema.py
# Define different form schemas that can be used for extraction

# Basic personal information form
PERSONAL_INFO_FORM = {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "date_of_birth": "string",
    "gender": "string"
}

# Job application form
JOB_APPLICATION_FORM = {
    "name": "string",
    "email": "string",
    "phone": "string",
    "position_applied_for": "string",
    "experience_years": "number",
    "skills": "array",
    "education": "string",
    "previous_company": "string",
    "reason_for_application": "string"
}

# Form schemas dictionary
FORM_SCHEMAS = {
    "personal_info": PERSONAL_INFO_FORM,
    "job_application": JOB_APPLICATION_FORM,
    # Add more form schemas as needed
}

def get_form_schema(form_type):
    """Get form schema by type"""
    return FORM_SCHEMAS.get(form_type, PERSONAL_INFO_FORM)
