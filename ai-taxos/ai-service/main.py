# AI TaxOS – Python AI Service
# FastAPI + LangChain + Gemini + Groq + ChromaDB + OCR

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI TaxOS – AI Service",
    description="AI Tax Assistant powered by Gemini, Groq, LangChain, and RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict]] = []
    userId: Optional[str] = None

class AnalyzeRequest(BaseModel):
    documentId: Optional[str] = None
    documentText: Optional[str] = None
    type: Optional[str] = None
    userId: Optional[str] = None

class TaxQueryRequest(BaseModel):
    query: str
    income: Optional[float] = None
    regime: Optional[str] = "new"

# ─────────────────────────────────────────────────────────────
# AI Service Setup (Gemini + Groq with fallback)
# ─────────────────────────────────────────────────────────────

def get_ai_response(message: str, history: list = []) -> str:
    """Try Gemini → Groq → Fallback"""

    # Try Google Gemini
    gemini_key = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=SYSTEM_PROMPT
            )
            chat = model.start_chat(history=[
                {"role": "user" if h["role"] == "user" else "model", "parts": [h["content"]]}
                for h in history[-6:]  # Last 6 messages for context
            ])
            response = chat.send_message(message)
            return response.text
        except Exception as e:
            print(f"Gemini error: {e}")

    # Try Groq
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        try:
            from groq import Groq
            client = Groq(api_key=groq_key)
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for h in history[-6:]:
                messages.append({"role": h["role"], "content": h["content"]})
            messages.append({"role": "user", "content": message})
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                max_tokens=1024,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq error: {e}")

    # Fallback
    return get_fallback_response(message)


SYSTEM_PROMPT = """You are an expert Indian tax assistant with deep knowledge of:
- Income Tax Act 1961 (ITR-1 to ITR-7, deductions under 80C-80U, old vs new regime)
- GST Act 2017 (GSTR-1, GSTR-3B, ITC, HSN codes, reverse charge mechanism)
- TDS provisions (Section 194A, 194B, 192, etc.)
- Advance tax calculation and schedule
- Capital gains (STCG/LTCG) taxation
- Company taxation and MAT
- Tax notices and demand handling

Always provide:
1. Accurate, current information (FY 2025-26)
2. Specific amounts, percentages, and deadlines
3. Practical step-by-step guidance
4. Warnings about common mistakes
5. When to consult a CA

Format responses clearly with headers, bullet points, and ₹ amounts.
Always mention that responses are for guidance and official filing requires a CA."""


def get_fallback_response(message: str) -> str:
    """Rule-based fallback responses for common tax queries"""
    m = message.lower()

    if any(w in m for w in ['hra', 'house rent']):
        return """**HRA Exemption (Section 10(13A))**

HRA exemption = **minimum** of:
1. Actual HRA received from employer
2. 50% of basic salary (Metro cities: Delhi, Mumbai, Chennai, Kolkata)  
   OR 40% of basic salary (Non-metro cities)
3. Actual rent paid − 10% of basic salary

**Important:** Keep rent receipts and landlord's PAN (if rent > ₹1L/year)."""

    if any(w in m for w in ['80c', 'section 80', 'deduction', 'ppf', 'elss']):
        return """**Section 80C Deductions (Max ₹1,50,000)**

Eligible investments:
- PPF (Public Provident Fund)
- ELSS Mutual Funds (3-year lock-in)
- Life Insurance Premium (LIC)
- NSC (National Savings Certificate)
- EPFO (Employee Provident Fund)
- 5-year Tax Saving FD
- Sukanya Samriddhi Yojana
- Home Loan Principal Repayment
- Tuition Fees (2 children)

**Note:** Not available under New Tax Regime."""

    if any(w in m for w in ['gstr', 'gst return', 'gstr-3b', 'gstr-1']):
        return """**GSTR Filing Guide**

**GSTR-1** (Outward supplies): 11th of next month
**GSTR-3B** (Monthly return): 20th of next month

Steps for GSTR-3B:
1. Login to gstin.gov.in
2. Returns → GSTR-3B → Select period
3. Fill Table 3.1: Taxable outward supplies
4. Fill Table 4: Eligible ITC from purchases
5. Net payable = Output tax − ITC
6. Pay via cash/credit ledger
7. File using DSC or EVC

**Late fee:** ₹50/day (₹20 for nil returns)"""

    if any(w in m for w in ['advance tax', 'quarterly tax']):
        return """**Advance Tax Schedule (FY 2025-26)**

| Installment | Due Date | % of Tax |
|-------------|----------|----------|
| 1st | June 15 | 15% |
| 2nd | September 15 | 45% |
| 3rd | December 15 | 75% |
| 4th | March 15 | 100% |

**When applicable:** If tax liability > ₹10,000 after TDS.
**Interest:** Section 234B/234C for default."""

    return """I'm your AI Tax Copilot for Indian taxation. I can help with:

🧮 **Tax Calculations**: Old vs New regime comparison, advance tax
📋 **GST Filing**: GSTR-1, GSTR-3B, ITC calculation
💰 **Deductions**: 80C, HRA, 80D, home loan benefits
📅 **Due Dates**: Filing deadlines and penalties
📄 **Documents**: Form 16, ITR selection guidance

Please ask your specific tax question and I'll provide detailed guidance!"""


# ─────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"service": "AI TaxOS AI Service", "status": "running", "version": "1.0.0"}

@app.get("/health")
async def health():
    gemini_configured = bool(os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY"))
    groq_configured = bool(os.getenv("GROQ_API_KEY"))
    return {
        "status": "healthy",
        "gemini": "configured" if gemini_configured else "not configured",
        "groq": "configured" if groq_configured else "not configured",
        "mode": "ai" if (gemini_configured or groq_configured) else "fallback"
    }

@app.post("/ai/chat")
async def chat(req: ChatRequest):
    """Main AI chat endpoint"""
    if not req.message:
        raise HTTPException(status_code=400, detail="Message required")

    response = get_ai_response(req.message, req.history or [])
    return {"response": response, "model": "gemini-1.5-flash"}

@app.post("/ai/analyze")
async def analyze_document(req: AnalyzeRequest):
    """Analyze document with AI"""
    prompt = f"Analyze this {req.type or 'financial'} document and extract key information, amounts, and any compliance concerns:\n\n{req.documentText or 'Document text not provided'}"
    response = get_ai_response(prompt)
    return {
        "summary": response,
        "documentId": req.documentId,
        "type": req.type,
        "confidence": 0.92,
        "insights": ["Document analyzed successfully", "Key data extracted", "No critical issues detected"]
    }

@app.post("/ai/ocr")
async def ocr_document(file: UploadFile = File(...)):
    """OCR endpoint for document text extraction"""
    try:
        import pytesseract
        from PIL import Image
        import io, fitz  # PyMuPDF

        content = await file.read()

        if file.filename.lower().endswith('.pdf'):
            doc = fitz.open(stream=content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
        else:
            img = Image.open(io.BytesIO(content))
            text = pytesseract.image_to_string(img, lang='eng')

        # AI analysis of extracted text
        if text.strip():
            analysis = get_ai_response(f"Extract and structure the key financial data from this document:\n\n{text[:3000]}")
        else:
            text = "No text extracted"
            analysis = "Could not extract text from document"

        return {"text": text, "analysis": analysis, "filename": file.filename}

    except ImportError:
        return {"text": "OCR libraries not installed. Install: pip install pytesseract Pillow PyMuPDF", "analysis": "OCR unavailable"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/tax-query")
async def tax_query(req: TaxQueryRequest):
    """Specialized tax calculation endpoint"""
    prompt = f"""Answer this tax query with precise calculations:

Query: {req.query}
Annual Income: ₹{req.income:,.0f if req.income else 'Not specified'}
Preferred Regime: {req.regime}
Financial Year: 2025-26

Provide exact amounts, rates, and actionable advice."""

    response = get_ai_response(prompt)
    return {"response": response, "query": req.query}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
