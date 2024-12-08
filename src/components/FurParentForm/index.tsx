import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Profile, useProfile } from '@/context/ProfileContext';
import LoadingScreen from '../LoadingScreen';

interface QuestionOption {
    label: string;
    value: string;
}

interface Question {
    title: string;
    field: keyof Profile;
    type: 'text' | 'select' | 'boolean';
    options?: QuestionOption[];
}

export default function ParentForm() {
    const router = useRouter();
    const { setProfile } = useProfile();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lifestyle: '',
        homeType: '',
        hasChildren: false,
        hasPets: false,
        experience: '',
        preferredSize: ''
    });

    const handleSubmit = async () => {
        setIsLoading(true)
        setProfile(formData as Profile);
        // Wait for next tick to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 0));
        router.push('/match');
    };

    const questions: Question[] = [
        {
            title: "What is your name?",
            field: 'name',
            type: 'text'
        },
        {
            title: "Where do you live?",
            field: 'homeType',
            type: 'select',
            options: [
                { label: 'Apartment', value: 'apartment' },
                { label: 'House', value: 'house' },
            ]
        },
        {
            title: "How much experience do you have with dogs?",
            field: 'experience',
            type: 'select',
            options: [
                { label: 'First Time', value: 'first-time' },
                { label: 'Some', value: 'some' },
                { label: 'Experienced', value: 'experienced' }
            ]
        },
        {
            title: "What's your lifestyle like?",
            field: 'lifestyle',
            type: 'select',
            options: [
                { label: 'Relaxed', value: 'relaxed' },
                { label: 'Moderately Active', value: 'moderate' },
                { label: 'Very Active', value: 'active' }
            ]
        },
        {
            title: "Do you have any children?",
            field: 'hasChildren',
            type: 'boolean',
        },
        {
            title: "Do you currently have any pets?",
            field: 'hasPets',
            type: 'boolean',
        },
        {
            title: "What is your preferred dog size?",
            field: 'preferredSize',
            type: 'select',
            options: [
                { label: 'Small', value: "small" },
                { label: 'Medium', value: "medium" },
                { label: 'Large', value: "large" },
                { label: 'Any', value: "any" },
            ]
        },
    ];

    const currentQuestion = questions[step];

    if (!currentQuestion) {
        return null;
    }

    if (isLoading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <Card className="w-full dark:bg-gray-800">
            <CardHeader>
                <h1 className="text-2xl font-bold text-center dark:text-white">
                    Let&apos;s Find Your Perfect Match
                </h1>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                <h2 className="text-xl dark:text-white">{currentQuestion.title}</h2>

                {currentQuestion.type === 'text' ? (
                    <input
                        type="text"
                        value={formData[currentQuestion.field] as string}
                        onChange={(e) =>
                            setFormData({ ...formData, [currentQuestion.field]: e.target.value })
                        }
                        className="w-full p-2 rounded border dark:bg-gray-700 dark:text-white"
                    />
                ) : currentQuestion.type === 'boolean' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={formData[currentQuestion.field] === true ? "default" : "outline"}
                            onClick={() =>
                                setFormData({ ...formData, [currentQuestion.field]: true })
                            }
                            className="w-full"
                        >
                            Yes
                        </Button>
                        <Button
                            variant={formData[currentQuestion.field] === false ? "default" : "outline"}
                            onClick={() =>
                                setFormData({ ...formData, [currentQuestion.field]: false })
                            }
                            className="w-full"
                        >
                            No
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {currentQuestion.options?.map((option) => (
                            <Button
                                key={option.value}
                                variant={formData[currentQuestion.field] === option.value ?
                                    "default" : "outline"}
                                onClick={() =>
                                    setFormData({ ...formData, [currentQuestion.field]: option.value })
                                }
                                className="w-full"
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                )}

                    <div className="flex justify-between mt-4">
                        <Button
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => {
                                if (step === questions.length - 1) {
                                    handleSubmit();
                                } else {
                                    setStep(step + 1);
                                }
                            }}
                        >
                            {step === questions.length - 1 ? 'Find Matches' : 'Next'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}