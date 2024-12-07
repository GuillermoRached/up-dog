'use client'

import React, { useRef, useState } from 'react';
import Image from 'next/image'
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, PawPrint, Baby, Dumbbell, Home, Sun, Coffee } from 'lucide-react';
import { Dog, DogTrait, DogTraitDisplay, getTraitIcon } from '@/types';

const DogSwiper = () => {
    const [dogs] = useState<Dog[]>([
        {
            id: 1,
            name: "Jackson",
            age: 5,
            image: "/dogs/jackson_teefs.jpg",
            traits: [DogTrait.KID_FRIENDLY, DogTrait.GOOD_WITH_CATS, DogTrait.HIGH_ENERGY],
            description: "Jackson is the emperor of the universe and he knows it.",
            compatibility: 150
        },
        {
            id: 2,
            name: "Luci",
            age: 3,
            image: "/dogs/luci_what.jpg",
            traits: [DogTrait.CALM, DogTrait.GOOD_WITH_DOGS, DogTrait.OUTDOOR_ENTHUSIAST, DogTrait.APARTMENT_FRIENDLY],
            description: "Luci is a home-grown couch 'tator. Looking for all the great and comfy couches out there.",
            compatibility: 150
        },
        {
            id: 3,
            name: "Zeus",
            age: 3,
            image: "/dogs/big_ovcharka.jpg",
            traits: [DogTrait.CALM, DogTrait.GOOD_WITH_DOGS, DogTrait.OUTDOOR_ENTHUSIAST, DogTrait.APARTMENT_FRIENDLY],
            description: "Zeus is a home-grown couch 'tator. Looking for all the great and comfy couches out there.",
            compatibility: 75
        },
        {
            id: 4,
            name: "Luci",
            age: 3,
            image: "/dogs/luci_what.jpg",
            traits: [DogTrait.CALM, DogTrait.GOOD_WITH_DOGS, DogTrait.OUTDOOR_ENTHUSIAST, DogTrait.APARTMENT_FRIENDLY],
            description: "Luci is a home-grown couch 'tator. Looking for all the great and comfy couches out there.",
            compatibility: 55
        },
        {
            id: 5,
            name: "Luci",
            age: 3,
            image: "/dogs/luci_what.jpg",
            traits: [DogTrait.CALM, DogTrait.GOOD_WITH_DOGS, DogTrait.OUTDOOR_ENTHUSIAST, DogTrait.APARTMENT_FRIENDLY],
            description: "Luci is a home-grown couch 'tator. Looking for all the great and comfy couches out there.",
            compatibility: 95
        },
    ]);

    const [currentDogIndex, setCurrentDogIndex] = useState(0);
    const [matches, setMatches] = useState<Dog[]>([]);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleSwipe = (liked: boolean) => {
        if (currentDogIndex >= dogs.length) return;

        if (liked) {
            setMatches([...matches, dogs[currentDogIndex]]);
        }

        setDragDelta({ x: liked ? 1000 : -1000, y: 0 });

        setTimeout(() => {
            setCurrentDogIndex(prev => prev + 1);
            setDragDelta({ x: 0, y: 0 });
        }, 300);
    };

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const point = 'touches' in e ? e.touches[0] : e;
        setDragStart({ x: point.clientX, y: point.clientY });
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        const point = 'touches' in e ? e.touches[0] : e;
        const delta = {
            x: point.clientX - dragStart.x,
            y: point.clientY - dragStart.y
        };
        setDragDelta(delta);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const threshold = window.innerWidth * 0.20; // 20% of screen width
        if (Math.abs(dragDelta.x) > threshold) {
            handleSwipe(dragDelta.x > 0);
        } else {
            setDragDelta({ x: 0, y: 0 });
        }
    };

    const getIconComponent = (iconName: string) => {
        const icons = {
            Baby,
            Dumbbell,
            Home,
            Sun,
            PawPrint,
            Heart,
            Coffee
        };
        return icons[iconName as keyof typeof icons] || PawPrint;
    };

    // Calculate rotation and opacity based on drag distance
    const getCardStyle = () => {
        const rotate = dragDelta.x * 0.1; // Adjust rotation speed
        return {
            transform: `translate(${dragDelta.x}px, ${dragDelta.y}px) rotate(${rotate}deg)`,
            transition: isDragging ? 'none' : 'all 0.3s ease'
        };
    };

    // Calculate like/dislike indicator opacity
    const getLikeOpacity = () => Math.min(Math.max(dragDelta.x / 100, 0), 1);
    const getDislikeOpacity = () => Math.min(Math.max(-dragDelta.x / 100, 0), 1);

    const currentDog = dogs[currentDogIndex];

    if (!currentDog) {
        return (
            <Card className="text-center p-6 max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">Your Matches ({matches.length})</h2>
                {matches.length > 0 ? (
                    <div className="space-y-4">
                        {matches.map((dog) => (
                            <div key={dog.id} className="flex items-center gap-4 border-b pb-4">
                                <Image
                                    src={dog.image}
                                    alt={dog.name}
                                    width={500}
                                    height={500}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="text-left">
                                    <h3 className="font-semibold">{dog.name}</h3>
                                    <p className="text-sm text-gray-600">100% Match</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No matches yet. Keep swiping!</p>
                )}
            </Card>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="mb-4 text-center">
                <h1 className="text-2xl font-bold mb-2">PawMatch</h1>
                <p className="text-sm text-gray-600">Find your perfect furry companion</p>
            </div>

            <div className="relative">
                {/* Like/Dislike Indicators */}
                <div
                    className="absolute top-12 left-8 transform rotate-[-30deg] border-4 border-green-500 rounded-xl px-4 py-2 z-10"
                    style={{ opacity: getLikeOpacity() }}
                >
                    <span className="text-green-500 font-bold text-2xl">LIKE</span>
                </div>
                <div
                    className="absolute top-12 right-8 transform rotate-[30deg] border-4 border-red-500 rounded-xl px-4 py-2 z-10"
                    style={{ opacity: getDislikeOpacity() }}
                >
                    <span className="text-red-500 font-bold text-2xl">NOPE</span>
                </div>

                {/* Draggable Card */}
                <div
                    ref={cardRef}
                    style={getCardStyle()}
                    className="cursor-grab active:cursor-grabbing"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                >
                    <Card>
                        <CardHeader className="p-0">
                            <Image
                                src={currentDog.image}
                                alt={currentDog.name}
                                width={500}
                                height={500}
                                className="w-full h-64 object-cover rounded-t-lg"
                                draggable={false}
                            />
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold">{currentDog.name}, {currentDog.age}</h2>
                                <span className="text-green-500 font-semibold">
                                    100% Match
                                </span>
                            </div>

                            <p className="text-gray-600 mb-3">{currentDog.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentDog.traits.map((trait, index) => {
                                    const IconComponent = getIconComponent(getTraitIcon(trait));
                                    return (
                                        <span
                                            key={index}
                                            className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                                        >
                                            <IconComponent className="mr-1" size={16} />
                                            {DogTraitDisplay[trait]}
                                        </span>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full p-6"
                                    onClick={() => handleSwipe(false)}
                                >
                                    <X className="text-red-500" size={24} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full p-6"
                                    onClick={() => handleSwipe(true)}
                                >
                                    <Heart className="text-green-500" size={24} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DogSwiper;