import json
import logging
from typing import List, Dict, Any, Optional
from google import genai
from google.genai import types
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize client on module import if key is provided
client = None
if settings.GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        logger.info("Successfully configured modern google-genai client.")
    except Exception as configure_err:
        logger.error(f"Error configuring modern google-genai: {configure_err}")
else:
    logger.warning("GEMINI_API_KEY is not set. Using rule-based fallback logic for AI analysis.")

class AIService:
    @staticmethod
    def _get_fallback_analysis(title: str, description: str, category: str) -> Dict[str, Any]:
        """
        Rule-based fallback if Gemini API is unavailable or fails.
        """
        logger.info("Executing rule-based AI fallback analysis.")
        words = description.split()
        summary = " ".join(words[:15]) + "..." if len(words) > 15 else description
        
        desc_lower = description.lower()
        priority = "Low"
        critical_keywords = ["bridge collapse", "water contamination", "hospital emergency", "collapse", "contamination", "leakage near hospital"]
        high_keywords = ["hazard", "accident", "injured", "danger", "broken pipe", "flooding", "sparking", "emergency", "pothole"]
        medium_keywords = ["not working", "blocked", "garbage", "leak", "darkness", "out of order"]
        
        for kw in critical_keywords:
            if kw in desc_lower:
                priority = "Critical"
                break
        if priority == "Low":
            for kw in high_keywords:
                if kw in desc_lower:
                    priority = "High"
                    break
        if priority == "Low":
            for kw in medium_keywords:
                if kw in desc_lower:
                    priority = "Medium"
                    break
                    
        reason = f"Urgency level assessed as {priority} priority due to detection of keywords matching public safety/infrastructure thresholds in category '{category}' (Fallback Mode)."
        
        # Tags
        tags = [category.lower().replace(" ", "-")]
        if "water" in desc_lower or "pipe" in desc_lower:
            tags.append("water-issue")
        if "road" in desc_lower or "pothole" in desc_lower:
            tags.append("road-issue")
        if "light" in desc_lower or "dark" in desc_lower:
            tags.append("lighting-issue")
            
        return {
            "summary": summary,
            "priority": priority,
            "priority_reason": reason,
            "tags": tags
        }

    @classmethod
    def analyze_complaint(cls, title: str, description: str, category: str) -> Dict[str, Any]:
        """
        Queries Gemini API to analyze complaint text and return summary, priority, reason, and tags in structured JSON.
        """
        global client
        if not settings.GEMINI_API_KEY or client is None:
            return cls._get_fallback_analysis(title, description, category)

        prompt = f"""
        Analyze this civic complaint.
        Generate a JSON object with the following fields:
        - 'summary': A concise one-sentence summary of the grievance.
        - 'priority': The urgency priority level (either 'Low', 'Medium', 'High', or 'Critical') based on hazard, public safety, and road risk.
        - 'priority_reason': A brief explanation of why this priority level was assigned.
        - 'tags': A list of 2-5 relevant keyword tags for routing.

        Complaint Title: {title}
        Category: {category}
        Complaint Description: {description}

        Return JSON only matching the schema exactly.
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            # Parse structured JSON output
            result = json.loads(response.text)
            
            # Validation checks to ensure all required fields are present
            required_keys = ["summary", "priority", "priority_reason", "tags"]
            for key in required_keys:
                if key not in result:
                    raise KeyError(f"Missing required key '{key}' in Gemini response.")
                    
            # Normalize priority value
            priority = str(result["priority"]).capitalize()
            if priority not in ["Low", "Medium", "High", "Critical"]:
                priority = "Medium"
            result["priority"] = priority
            
            return result
        except Exception as e:
            logger.error(f"Gemini API analysis failed: {e}. Falling back...")
            return cls._get_fallback_analysis(title, description, category)

ai_service = AIService()
