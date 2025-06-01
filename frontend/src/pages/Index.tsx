
import CareerForm from "@/components/CareerForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Compass</h1>
        <p className="text-lg text-gray-600">Shape your future in tech</p>
      </div>
      <CareerForm />
    </div>
  );
};

export default Index;
