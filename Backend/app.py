from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
import re
import json5
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from langchain_ollama import OllamaLLM

app = Flask(__name__)
CORS(app)

load_dotenv()
model = OllamaLLM(model="llama3")

with open('data.json') as f:
    data = json.load(f)
df = pd.DataFrame(data)

df['tags_combined'] = df.apply(
    lambda row: ' '.join(row['interest_tags']) + ' ' + ' '.join(row['career_goals']) + ' ' + ' '.join(row.get('skills_required', [])),
    axis=1
)

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df['tags_combined'])

def generate_ollama_roadmap_and_resources(career_title):
    try:
        prompt = (
            f"You are a professional career advisor. Generate a valid JSON object for someone becoming a {career_title}.\n"
            f"The JSON must have two keys:\n"
            f"1. 'roadmap': a list of learning steps (strings)\n"
            f"2. 'resources': a list of objects with 'title' and 'link'\n\n"
            f"Example format:\n"
            f'{{\n'
            f'  "roadmap": ["Step 1", "Step 2"],\n'
            f'  "resources": [{{"title": "Name", "link": "https://..."}}]\n'
            f'}}\n\n'
            f"Strictly return only the JSON. No markdown, no extra explanation."
        )
#         prompt = (
#     f"You're an expert career advisor. Generate a structured career roadmap for someone who wants to become a {career_title}. "
#     f"Format the response as valid JSON with a key 'roadmap' that contains a list of stages. Each stage should include:\n"
#     f"- stage (number),\n- title (string),\n- description (string),\n- topics (list of objects with 'name', 'description', and 'resources').\n"
#     f"Each topic should contain 1–2 learning resources as a list of objects with 'title' and 'link'.\n"
#     f"Only return valid JSON — no markdown, no explanation.\n"
# )

        response = model.invoke(prompt).strip()

        # Remove markdown/quote wrapping (e.g., ```json ... ```, """ ... """, etc.)
        response = re.sub(r'^```[a-zA-Z]*|```$', '', response).strip()
        response = re.sub(r'^["\']{3}|["\']{3}$', '', response).strip()

        # Extract JSON block from messy text
        match = re.search(r'{[\s\S]*}', response)
        if not match:
            raise ValueError("No valid JSON structure found.")

        cleaned_json = match.group(0)

        parsed = json5.loads(cleaned_json)

        roadmap = parsed.get("roadmap", ["No roadmap provided."])
        resources = parsed.get("resources", [{"title": "No resources", "link": "#"}])

        return roadmap, resources

    except Exception as e:
        print(f"Ollama generation error for {career_title}: {e}")
        return ["Roadmap generation failed."], [{"title": "Error", "link": "#"}]

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        interests = data.get('interests', [])
        goals = data.get('goals', [])
        skills = data.get('skills', [])

        if not interests and not goals and not skills:
            return jsonify({"error": "No interests, goals, or skills provided"}), 400

        user_input = ' '.join(interests + goals + skills)
        user_vec = vectorizer.transform([user_input])
        similarity_scores = cosine_similarity(user_vec, tfidf_matrix).flatten()
        top_indices = similarity_scores.argsort()[-5:][::-1]

        recommendations = []
        for idx in top_indices:
            row = df.iloc[idx]
            recommendations.append({
                "id": row['id'],
                "title": row['title'],
                "description": row['description']
            })

        return jsonify(recommendations)

    except Exception as e:
        print(f"Error in /recommend route: {e}")
        return jsonify({"error": "Something went wrong on the server."}), 500

@app.route('/generate_roadmap', methods=['POST'])
def generate_roadmap():
    try:
        data = request.json
        title = data.get("title")
        if not title:
            return jsonify({"error": "No title provided"}), 400

        roadmap, resources = generate_ollama_roadmap_and_resources(title)

        matched_row = df[df['title'].str.lower() == title.lower()]
        skills_required = []
        if not matched_row.empty:
            skills_required = matched_row.iloc[0].get("skills_required", [])
            if isinstance(skills_required, str):
                try:
                    skills_required = json.loads(skills_required)
                except:
                    skills_required = [skills_required]

        return jsonify({
            "roadmap": roadmap,
            "resources": resources,
            "skills_required": skills_required
        })

    except Exception as e:
        print(f"Error in /generate_roadmap route: {e}")
        return jsonify({
            "roadmap": ["Failed to generate roadmap."],
            "resources": [{"title": "Error", "link": "#"}],
            "skills_required": [],
            "error": str(e)
        })

@app.route('/')
def home():
    return "Career Compass Backend is running!"

if __name__ == "__main__":
    app.run(debug=True)

