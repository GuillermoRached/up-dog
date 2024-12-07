import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dog, Heart, Home, Clock, Dumbbell } from 'lucide-react';

const FurParentForm = () => {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    experience: null,
    housing: null,
    activity: null,
    hours: null
  });
  
  const questions = [
    {
      title: "What's your experience with dogs?",
      options: [
        { icon: <Dog className="mb-2" size={24} />, label: "First-time owner", value: "beginner" },
        { icon: <Dog className="mb-2" size={24} />, label: "Had dogs before", value: "intermediate" },
        { icon: <Dog className="mb-2" size={24} />, label: "Very experienced", value: "expert" }
      ],
      key: "experience"
    },
    {
      title: "What's your living situation?",
      options: [
        { icon: <Home className="mb-2" size={24} />, label: "Apartment", value: "apartment" },
        { icon: <Home className="mb-2" size={24} />, label: "House with yard", value: "house" }
      ],
      key: "housing"
    },
    {
      title: "How active is your lifestyle?",
      options: [
        { icon: <Dumbbell className="mb-2" size={24} />, label: "Relaxed", value: "low" },
        { icon: <Dumbbell className="mb-2" size={24} />, label: "Moderate", value: "medium" },
        { icon: <Dumbbell className="mb-2" size={24} />, label: "Very active", value: "high" }
      ],
      key: "activity"
    },
    {
      title: "How many hours will the dog be alone?",
      options: [
        { icon: <Clock className="mb-2" size={24} />, label: "2-4 hours", value: "short" },
        { icon: <Clock className="mb-2" size={24} />, label: "4-8 hours", value: "medium" },
        { icon: <Clock className="mb-2" size={24} />, label: "8+ hours", value: "long" }
      ],
      key: "hours"
    }
  ];

  const handleSelect = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const currentQuestion = questions[step];

  const getMatchingResults = () => {
    // This would normally call an API with the preferences
    // For demo purposes, we'll show a simple result
    return (
      <div className="text-center p-4">
        <Heart className="mx-auto mb-4" size={48} color="#e11d48" />
        <h3 className="text-xl font-semibold mb-2">We've Found Your Matches!</h3>
        <p className="mb-4">Based on your preferences, here are some dogs you might love:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <img src="/api/placeholder/300/200" alt="Dog" className="rounded-lg mb-2" />
            <h4 className="font-semibold">Luna</h4>
            <p className="text-sm">A gentle 2-year-old Lab mix perfect for first-time owners</p>
          </Card>
          <Card className="p-4">
            <img src="/api/placeholder/300/200" alt="Dog" className="rounded-lg mb-2" />
            <h4 className="font-semibold">Max</h4>
            <p className="text-sm">An active 3-year-old Shepherd who loves apartment living</p>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Find Your Perfect Canine Companion</CardTitle>
      </CardHeader>
      <CardContent>
        {step < questions.length ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center mb-6">{currentQuestion.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="p-6 h-auto flex flex-col items-center justify-center text-center"
                  onClick={() => handleSelect(currentQuestion.key, option.value)}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                Previous
              </Button>
              <div className="text-sm text-gray-500">
                Step {step + 1} of {questions.length}
              </div>
            </div>
          </div>
        ) : (
          getMatchingResults()
        )}
      </CardContent>
    </Card>
  );
};

export default FurParentForm;