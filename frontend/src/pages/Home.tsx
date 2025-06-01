import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm border-b bg-white">
        <h1 className="text-xl font-bold text-purple-700">Career Compass</h1>
        <nav className="space-x-6 text-gray-600 font-medium">

        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center bg-gray-50 px-4 py-16">
        <img
          src="/logo3.png"
          alt="Career Illustration"
          className="w-72 h-72 mb-6"
          
        />

        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">Find Your Career Path with Career Compass</h2>
        <p className="text-gray-600 text-lg max-w-xl mb-8">
          Explore the skills and knowledge needed for your dream tech career with our interactive roadmaps.
        </p>
        <Button
          onClick={() => navigate("/form")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg rounded-md flex items-center gap-2"
        >
          <RocketIcon size={20} />
          Get Started
        </Button>
      </main>
    </div>
  );
};

export default Home;
