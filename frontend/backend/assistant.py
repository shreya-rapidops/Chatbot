import requests

GEMINI_API_KEY = "AIzaSyA3-bufue0yqv37scwr3Hbyszu2s8p9SGs"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def get_gemini_response(prompt):
    try:
        headers = { "Content-Type": "application/json" }
        data = {
            "contents": [{
                "role": "user",
                "parts": [{"text": prompt}]
            }]
        }
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=data
        )
        if response.status_code == 200:
            return response.json()['candidates'][0]['content']['parts'][0]['text']
        return f"Error getting AI response: {response.text}"
    except Exception as e:
        print(f"[Gemini Error]: {e}")
        return "Internal error."

def get_response_from_command(command):
    return get_gemini_response(command)
