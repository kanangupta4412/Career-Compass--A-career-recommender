import { useLocation } from "react-router-dom";
import { useState } from "react";

interface Recommendation {
  title: string;
  description: string;
}

interface RoadmapData {
  roadmap: string[] | string;
  resources: { title: string; link: string }[] | string[];
  skills_required: string[];
}

const Results = () => {
  const location = useLocation();
  const recommendations = location.state?.recommendations as Recommendation[];
  const userSkills = location.state?.skills as string[]; // <-- From Career Form

  const [selectedCareerTitle, setSelectedCareerTitle] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState<Record<string, RoadmapData>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectCareer = async (careerTitle: string) => {
    if (selectedCareerTitle === careerTitle) {
      setSelectedCareerTitle(null);
      return;
    }

    setSelectedCareerTitle(careerTitle);

    if (!roadmapData[careerTitle]) {
      setLoading(careerTitle);
      try {
        const response = await fetch("http://localhost:5000/generate_roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: careerTitle }),
        });

        const data = await response.json();
        setRoadmapData((prev) => ({ ...prev, [careerTitle]: data }));
      } catch (error) {
        console.error("Error fetching roadmap:", error);
        setRoadmapData((prev) => ({
          ...prev,
          [careerTitle]: {
            roadmap: ["Failed to fetch roadmap."],
            resources: ["Error loading resources."],
            skills_required: [],
          },
        }));
      } finally {
        setLoading(null);
      }
    }
  };

const getSkillMatchPercentage = (required: string[]) => {
  const normalizedUserSkills = (userSkills || []).map(skill => skill.toLowerCase().trim());
  const normalizedRequired = required.map(skill => skill.toLowerCase().trim());

  const matchedSkills = normalizedRequired.filter(reqSkill =>
    normalizedUserSkills.some(userSkill =>
      userSkill.includes(reqSkill) || reqSkill.includes(userSkill)
    )
  );

  return {
    matchedCount: matchedSkills.length,
    totalCount: normalizedRequired.length,
    percentage:
      normalizedRequired.length > 0
        ? Math.round((matchedSkills.length / normalizedRequired.length) * 100)
        : 100,
    matchedSkills,
  };
};

const getMissingSkills = (required: string[]) => {
  const normalizedUserSkills = (userSkills || []).map(skill => skill.toLowerCase().trim());

  return required.filter(reqSkill => {
    const normalizedReqSkill = reqSkill.toLowerCase().trim();
    return !normalizedUserSkills.some(userSkill =>
      userSkill.includes(normalizedReqSkill) || normalizedReqSkill.includes(userSkill)
    );
  });
};

 

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Recommended Careers</h1>

        <div className="grid gap-6">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((rec, idx) => {
              const roadmapInfo = roadmapData[rec.title];
              const isSelected = selectedCareerTitle === rec.title;
              const isLoading = loading === rec.title;

              return (
                <div
                  key={idx}
                  className={`bg-white p-6 rounded-xl shadow-md transition-all duration-300 ${
                    isSelected ? "border-2 border-purple-600" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{rec.title}</h2>
                      <p className="text-gray-600 mb-4">{rec.description}</p>
                    </div>
                    <button
                      onClick={() => handleSelectCareer(rec.title)}
                      className={`py-2 px-6 rounded-md font-semibold ${
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-300 hover:bg-purple-600 hover:text-white"
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Loading...
                        </span>
                      ) : isSelected ? "Selected" : "Select"}
                    </button>
                  </div>

                  {/* Display Roadmap and Resources */}
                  {isSelected && !isLoading && roadmapInfo && (
                    <div className="mt-8 bg-gray-50 p-6 rounded-lg space-y-8 animate-fadeIn">
                      {/* Roadmap */}
                      {/* {roadmapInfo.roadmap && (
                        <div>
                          <h3 className="text-2xl font-semibold text-purple-700 mb-4">Career Roadmap:</h3>
                          {Array.isArray(roadmapInfo.roadmap) ? (
                            <ul className="list-decimal list-inside space-y-2 text-gray-700">
                              {roadmapInfo.roadmap.map((step, stepIdx) => (
                                <li key={stepIdx}>{step}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-700 whitespace-pre-line">{roadmapInfo.roadmap}</p>
                          )}
                        </div>
                      )} */}
                      {roadmapInfo.roadmap && (
  <div>
    <h3 className="text-2xl font-semibold text-purple-700 mb-4">Career Roadmap:</h3>
    {Array.isArray(roadmapInfo.roadmap) ? (
      <div className="space-y-6">
        {roadmapInfo.roadmap.map((step, stepIdx) => (
          <div
            key={stepIdx}
            className="bg-white border border-purple-200 shadow-md rounded-lg p-4 transition duration-300 hover:shadow-lg"
          >
            <h4 className="text-lg font-bold text-purple-800">Step {stepIdx + 1}</h4>
            <p className="text-gray-700 mt-2">{step}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-700 whitespace-pre-line">{roadmapInfo.roadmap}</p>
    )}
  </div>
)}


                      {/* Resources */}
                      {roadmapInfo.resources && (
                        <div>
                          <h3 className="text-2xl font-semibold text-purple-700 mb-4">Resources:</h3>
                          {Array.isArray(roadmapInfo.resources) ? (
                            <ul className="list-disc list-inside space-y-2 text-purple-600">
                              {roadmapInfo.resources.map((res, i) => {
                                if (typeof res === "string") return <li key={i}>{res}</li>;
                                return (
                                  <li key={i}>
                                    <a
                                      href={res.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline"
                                    >
                                      {res.title}
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-purple-700 whitespace-pre-line">{roadmapInfo.resources}</p>
                          )}
                        </div>
                      )}

                      {/* Missing Skills */}
                      {/* Enhanced Skill Gap Analyzer */}
{roadmapInfo.skills_required && (
  <div>
    <h3 className="text-2xl font-semibold text-blue-600 mt-6 mb-2">Skill Gap Analysis:</h3>

    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-500"
        style={{ width: `${getSkillMatchPercentage(roadmapInfo.skills_required).percentage}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-600 mb-4">
      You match {getSkillMatchPercentage(roadmapInfo.skills_required).matchedCount} out of{" "}
      {getSkillMatchPercentage(roadmapInfo.skills_required).totalCount} required skills (
      {getSkillMatchPercentage(roadmapInfo.skills_required).percentage}%)
    </p>

    {/* Matched Skills */}
    {getSkillMatchPercentage(roadmapInfo.skills_required).matchedSkills.length > 0 && (
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-green-600">Matched Skills:</h4>
        <ul className="list-disc list-inside space-y-1 text-green-600">
          {getSkillMatchPercentage(roadmapInfo.skills_required).matchedSkills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Missing Skills */}
    {getMissingSkills(roadmapInfo.skills_required).length > 0 ? (
      <div>
        <h4 className="text-lg font-semibold text-red-600">Missing Skills:</h4>
        <ul className="list-disc list-inside space-y-1 text-red-500">
          {getMissingSkills(roadmapInfo.skills_required).map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>
    ) : (
      <p className="text-green-700 font-medium">You have all the required skills! 🎉</p>
    )}
  </div>
)}

                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No recommendations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;


