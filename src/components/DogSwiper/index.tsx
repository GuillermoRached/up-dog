'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, PawPrint, Baby, Dumbbell, Home, Sun, Coffee } from 'lucide-react';
import { Dog, DogTraitDisplay, getTraitIcon } from '@/types';

const DogSwiper = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [currentDogIndex, setCurrentDogIndex] = useState(0);
    const [matches, setMatches] = useState<Dog[]>([]);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const cardRef = useRef<HTMLDivElement>(null);

    const fetchDogs = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/dogs?page=${page}&limit=10`);
            const newDogs = await response.json();
            setDogs(prevDogs => [...prevDogs, ...newDogs]);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching dogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchDogs();
    });

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

    if (dogs.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

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
                                    fill
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="text-left">
                                    <h3 className="font-semibold">{dog.name}</h3>
                                    <p className="text-sm text-gray-600">{dog.compatibility}% Match</p>
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
                            <div className="relative w-full h-64 bg-gray-100">
                                <Image
                                    src={currentDog.image}
                                    alt={currentDog.name}
                                    fill
                                    className="object-contain rounded-t-lg"
                                    draggable={false}
                                    priority={true}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold">{currentDog.name}, {currentDog.age}</h2>
                                <span className="text-green-500 font-semibold">
                                    {currentDog.compatibility}% Match
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