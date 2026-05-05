import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from ..core.config import settings

def process_judgment_text(text: str) -> dict:
    """
    Uses LangChain and Gemini to extract structured insights from judgment text.
    """
    if not settings.GEMINI_API_KEY:
        print("Warning: GEMINI_API_KEY is not set. Returning dummy data.")
        return _get_dummy_data()

    # Initialize Gemini model
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro", 
        google_api_key=settings.GEMINI_API_KEY,
        temperature=0.1
    )

    prompt = PromptTemplate(
        input_variables=["text"],
        template="""
You are an advanced legal AI assistant for a government department. Your task is to analyze the following court judgment and extract critical information for administrative execution.
You must return the result ONLY as a valid JSON object without markdown wrappers or code blocks.

Extract the following fields:
- "case_title": Title of the case (e.g., "John Doe vs State of XYZ")
- "court_name": Name of the court (e.g., "High Court of Karnataka")
- "judgment_date": Date of the judgment
- "directives": A list of objects containing {{"directive": "what needs to be done", "context": "brief context"}}
- "deadlines": A list of objects containing {{"task": "description", "deadline_date": "date/timeframe", "is_urgent": boolean}}
- "responsible_authorities": A list of strings identifying the departments or roles responsible.
- "risk_level": "High", "Medium", or "Low" based on consequences of non-compliance (e.g., contempt of court).
- "recommendations": A list of objects containing {{"action": "recommendation", "priority": "High/Medium/Low"}}
- "explainable_reasoning": A list of objects explaining the recommendations, containing {{"recommendation": "action", "reason": "why", "source_quote": "exact phrase from text"}}

Judgment Text:
{text}
"""
    )

    chain = prompt | llm

    try:
        # We might need to truncate text if it exceeds Gemini's context window, 
        # but Gemini 1.5 Pro has a large context window.
        response = chain.invoke({"text": text})
        
        # Parse the JSON response
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        result = json.loads(content)
        return result
    except Exception as e:
        print(f"Error in Gemini extraction: {e}")
        return _get_dummy_data()

def _get_dummy_data() -> dict:
    return {
        "case_title": "Sample Case vs Government",
        "court_name": "High Court",
        "judgment_date": "2023-10-01",
        "directives": [{"directive": "Issue compensation within 4 weeks", "context": "Petitioner was wrongfully denied pension"}],
        "deadlines": [{"task": "Issue compensation", "deadline_date": "4 weeks from judgment", "is_urgent": True}],
        "responsible_authorities": ["Department of Finance", "Pension Office"],
        "risk_level": "High",
        "recommendations": [{"action": "Approve compensation immediately", "priority": "High"}],
        "explainable_reasoning": [{"recommendation": "Approve compensation immediately", "reason": "Avoid contempt proceedings", "source_quote": "Failure to comply will result in severe penalties"}]
    }
