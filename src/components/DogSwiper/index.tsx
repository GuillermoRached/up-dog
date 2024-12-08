'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, PawPrint, Baby, Dumbbell, Home, Sun, Coffee } from 'lucide-react';
import { Dog, DogTraitDisplay, getTraitIcon } from '@/types';
import { useProfile } from '@/context/ProfileContext';

interface DogSwiperProps {
    dogs: Dog[]
}

const DogSwiper = ({ dogs }: DogSwiperProps) => {
    const { profile } = useProfile();
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

        setDragDelta({ x: liked ? 3000 : -3000, y: 0 });

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

    const getCardStyle = () => {
        const rotate = dragDelta.x * 0.1;
        const opacity = Math.max(1 - Math.abs(dragDelta.x) / (window.innerWidth * 0.8), 0);
        return {
            transform: `translate(${dragDelta.x}px, ${dragDelta.y}px) rotate(${rotate}deg)`,
            opacity: opacity,
            transition: isDragging ? 'none' : 'all 0.5s ease'
        };
    };

    // Calculate like/dislike indicator opacity
    const getLikeOpacity = () => Math.min(Math.max(dragDelta.x / 100, 0), 1);
    const getDislikeOpacity = () => Math.min(Math.max(-dragDelta.x / 100, 0), 1);

    const currentDog = dogs[currentDogIndex];

    useEffect(() => {

    })
    if (!profile) {
        return (
            <div>
                <h1>Something went wrong...</h1>
                <p>No data received from form.</p>
            </div>
        )
    }

    if (dogs.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!currentDog) {
        return (
            <Card className="text-center p-6 max-w-md mx-auto dark:bg-gray-800">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Your Matches ({matches.length})</h2>
                {matches.length > 0 ? (
                    <div className="space-y-4">
                        {matches.sort((a, b) => a.compatibility < b.compatibility ? 1 : a.compatibility > b.compatibility ? -1 : 0).map((dog) => (
                            <div key={dog.id} className="flex items-center gap-4 border-b dark:border-gray-700 pb-4">
                                <div className="relative w-16 h-16">
                                    <Image
                                        src={dog.image}
                                        alt={dog.name}
                                        fill
                                        className="rounded-full object-contain"
                                    />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold dark:text-white">{dog.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{dog.compatibility}% Match</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">No matches yet. Keep swiping!</p>
                )}
            </Card>
        );
    }

    return (
        <div className="max-w-lg mx-auto p-4">
            <div className="mb-4 text-center">
                <h1 className="text-2xl font-bold mb-2 dark:text-white">PawMatch</h1>
                {profile && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome, {profile.name}!</p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">Find your perfect furry companion</p>
            </div>

            <div className="relative">
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
                    <Card className="dark:bg-gray-800">
                        <CardHeader className="p-0">
                            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700">
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
                                <h2 className="text-xl font-bold dark:text-white">{currentDog.name}, {currentDog.age}</h2>
                                <span className="text-green-500 font-semibold">
                                    {currentDog.compatibility}% Match
                                </span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-3">{currentDog.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentDog.traits.map((trait, index) => {
                                    const IconComponent = getIconComponent(getTraitIcon(trait));
                                    return (
                                        <span
                                            key={index}
                                            className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm dark:text-white"
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
                                    className="rounded-full p-6 dark:border-gray-600 dark:hover:bg-gray-700"
                                    onClick={() => handleSwipe(false)}
                                >
                                    <X className="text-red-500" size={24} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full p-6 dark:border-gray-600 dark:hover:bg-gray-700"
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