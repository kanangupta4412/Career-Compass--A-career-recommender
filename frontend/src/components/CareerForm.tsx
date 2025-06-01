import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Book, Rocket, Brain, Check, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const CareerForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [longTermGoal, setLongTermGoal] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<{title: string, description: string; skill_gaps?: string[]}[]>([]);
  const [open, setOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading] = useState(false);


  const areas = [
    "AI/ML",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "Blockchain",
  ];

  const goals = [
    { value: "job", label: "Get a job", icon: <Briefcase className="w-5 h-5 mr-2" /> },
    { value: "freelance", label: "Do freelancing", icon: <Rocket className="w-5 h-5 mr-2" /> },
    { value: "higher-studies", label: "Pursue higher studies", icon: <GraduationCap className="w-5 h-5 mr-2" /> },
    { value: "research", label: "Contribute to research", icon: <Brain className="w-5 h-5 mr-2" /> },
  ];

  const [skills, setSkills] = useState([
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "SQL",
    "Git",
    "Docker",
    "AWS",
    "TypeScript",
  ]);

  const navigate = useNavigate();


  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill && !skills.includes(customSkill)) {
      setSkills((prev) => [...prev, customSkill]);
      setSelectedSkills((prev) => [...prev, customSkill]);
      setCustomSkill("");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); 
      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: [areaOfInterest, ...selectedSkills],
          goals: [longTermGoal],
          current_skills: selectedSkills,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
         navigate("/results", {
         state: {
          recommendations: data,
          areaOfInterest,
          longTermGoal,
          skills: selectedSkills, // renamed for clarity in Results.tsx
        },
      });
      } else {
        console.error("Failed to fetch recommendations");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-purple-600">What's your area of interest?</h2>
            <p className="text-center text-gray-500 mb-4">Select the technology area that interests you the most.</p>
            <Select value={areaOfInterest} onValueChange={setAreaOfInterest}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an area of interest" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-between mt-4">
              <div />
              <Button
                onClick={handleNextStep}
                disabled={!areaOfInterest}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next →
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-purple-600">What's your long-term goal?</h2>
            <p className="text-center text-gray-500 mb-4">Choose where you want your career to take you.</p>
            <RadioGroup value={longTermGoal} onValueChange={setLongTermGoal} className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.value} className="flex items-center">
                  <RadioGroupItem value={goal.value} id={goal.value} className="peer sr-only" />
                  <Label
                    htmlFor={goal.value}
                    className="flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {goal.icon}
                      {goal.label}
                    </div>
                    <Check className={cn("w-5 h-5", longTermGoal === goal.value ? "text-purple-600" : "invisible")} />
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handlePreviousStep}>
                ← Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!longTermGoal}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next →
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-purple-600">Select your skills</h2>
            <p className="text-center text-gray-500 mb-4">Choose or add the technologies you're proficient with.</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add a custom skill..."
                className="flex-1 rounded-md border border-input px-3 py-2 text-sm"
              />
              <Button
                onClick={handleAddCustomSkill}
                variant="outline"
                disabled={!customSkill || skills.includes(customSkill)}
              >
                Add
              </Button>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-dashed">
                  {selectedSkills.length > 0 ? `${selectedSkills.length} skills selected` : "Select skills"}
                  <Book className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search skills..." className="h-9" />
                  <CommandEmpty>No skill found.</CommandEmpty>
                  <CommandGroup>
                    {skills.map((skill) => (
                      <CommandItem
                        key={skill}
                        onSelect={() => handleSkillSelect(skill)}
                        className="flex items-center gap-2"
                      >
                        <Check className={cn("h-4 w-4", selectedSkills.includes(skill) ? "opacity-100" : "opacity-0")} />
                        {skill}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2 mt-3">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                >
                  {skill}
                  <button
                    className="ml-1 hover:text-red-500"
                    onClick={() => handleSkillSelect(skill)}
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handlePreviousStep}>
                ← Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedSkills.length === 0 || loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[500px] w-full max-w-md mx-auto">
      <div className="flex mb-6 space-x-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex-1 h-1 rounded-full ${
              currentStep >= step ? "bg-purple-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {renderStep()}

      {/* Show Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Recommended Careers:</h2>
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 mb-3 border rounded-md shadow-sm bg-gray-50"
            >
              <h3 className="text-lg font-bold">{rec.title}</h3>
              <p className="text-gray-600 mt-1">{rec.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerForm;
