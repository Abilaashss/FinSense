import ollama

stream = ollama.chat(
    model='llama3:latest',
    messages=[{'role': 'user', 'content': '''
आयकर निमागामरत सर्कारINCOME TAX DEPARTMENTGOVT. OF INDIAD MANIKANDANDANDURAISAMY16/07/1986Permanent Account NumberBNZPM2501FB.manikamalouSignature04082011
Convert the above data into a JSON format using the following JSON schema:
               {
    "document_type":"Type of the document (PAN/Aadhar/Passport/Driving)",
    "document_id":"Aadhar number/PAN Number/Driving License PIN/other (null otherwise)",
    "name":"Name of the Person (null otherwise)",
    "dob":"Date of Birth of the given person (DD/MM/YY format) (null otherwise)",
    "gender":"Gender of the Person (M/F) (null otherwise)",
    "address":"Address of the person (null otherwise)",
    "mobile":"Mobile Number/Phone Number of the person (null otherwise)",
    "doi":"Date of Issue of the document (DD/MM/YY format) (null otherwise)",
    "doe":"Date of Expiry of the document (DD/MM/YY format) (null otherwise)",
    "place_of_issue":"Place of Issue of the document (null otherwise)"
}
'''}],
    stream=True,
)

for chunk in stream:
  print(chunk['message']['content'], end='', flush=True)