# Career Compass – A Career Path Recommender

**Career Compass** is a personalized career path recommender system built for B.Tech students.  
It helps users discover suitable career options based on their interests, goals, and current skills, and provides detailed roadmaps with skill gap analysis and learning resources.

## 🚀 Features

- Input your interests, career goals, and current skills
- AI-generated personalized career roadmaps
- Skill gap analysis to identify missing competencies
- Learning resources and tools for each roadmap stage
- Clean React frontend + Flask backend

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Flask
- **AI**: Ollama (LLaMA 3 via LangChain)
- **Database**: JSON or SQLite
- **Tools**: Python, JavaScript, HTML, CSS

## 📁 Project Structure
CareerRecommender/
│
├── app.py # Flask backend
├── frontend/ # React frontend
├── data/ # JSON career data
├── static/ # Static files (optional)
├── templates/ # HTML templates (if needed)
├── .gitignore
├── README.md
└── requirements.txt # Python dependencies

---

## ⚙️ Setup Instructions

### Backend (Flask)
```bash
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate     # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py

### Frontend
cd frontend
npm install
npm start



