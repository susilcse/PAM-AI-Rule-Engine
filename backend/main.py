from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import PyPDF2
import io
import os
from openai import OpenAI
from dotenv import load_dotenv
import json
from typing import Dict, Any

# Load environment variables
load_dotenv()

app = FastAPI(title="PAM AI Rule Engine API")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/")
async def root():
    return {"message": "PAM AI Rule Engine API"}

@app.post("/upload-contract")
async def upload_contract(file: UploadFile = File(...)):
    """Upload and process a PDF contract"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read PDF content
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text()
        
        # Generate contract summary using OpenAI
        summary = await generate_contract_summary(text_content[:2000])  # Limit text length
        
        return {
            "filename": file.filename,
            "text_content": text_content[:1000],  # Return first 1000 chars for preview
            "summary": summary,
            "pages": len(pdf_reader.pages)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/parse-rule")
async def parse_rule(rule_description: str):
    """Parse natural language rule description using OpenAI"""
    try:
        prompt = f"""
        Parse this business rule description and return a structured JSON response:
        
        Rule: "{rule_description}"
        
        Return a JSON object with:
        - name: descriptive rule name
        - category: one of [revenue, quality, performance, compliance, other]
        - priority: one of [low, medium, high, critical]
        - fields: array of field objects with name, type, value, validation rules
        
        Example types: percentage, currency, number, text, boolean
        Example validation: min, max values where applicable
        
        Return only valid JSON, no other text.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Use cheaper model for prototyping
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,  # Low temperature for consistent output
            max_tokens=500
        )
        
        # Parse the response
        rule_data = json.loads(response.choices[0].message.content)
        return rule_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing rule: {str(e)}")

@app.post("/chat")
async def chat_with_ai(message: str):
    """Simple chat endpoint for rule modifications"""
    try:
        prompt = f"""
        You are an AI assistant helping with contract rule creation and modification.
        User message: "{message}"
        
        Provide a helpful response about rule creation, modification, or contract management.
        Keep responses concise and practical.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )
        
        return {
            "response": response.choices[0].message.content,
            "model": "gpt-3.5-turbo"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

async def generate_contract_summary(text: str) -> Dict[str, Any]:
    """Generate contract summary using OpenAI"""
    try:
        prompt = f"""
        Analyze this contract text and provide a structured summary:
        
        Contract Text: {text[:1500]}...
        
        Return a JSON object with:
        - summary: brief overview
        - key_points: array of 3-5 key points
        - financial_terms: any financial information found
        - risks: potential risks identified
        - opportunities: potential opportunities
        
        Return only valid JSON, no other text.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=400
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        # Return basic summary if AI fails
        return {
            "summary": "Contract analysis completed",
            "key_points": ["Contract uploaded successfully", "Text extracted", "Ready for rule creation"],
            "financial_terms": {},
            "risks": [],
            "opportunities": []
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
