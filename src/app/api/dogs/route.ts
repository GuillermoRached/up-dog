// src/app/api/dogs/route.ts
import { NextResponse } from 'next/server';
import { Dog, DogTrait } from '@/types';

const localImages = [
  '/dogs/big_ovcharka.jpg',
  '/dogs/jackson_smile_on_rock.jpg',
  '/dogs/jackson_teefs.jpg',
  '/dogs/luci_and_jackson_on_rock.jpg',
  '/dogs/luci_smile.jpg',
  '/dogs/luci_what.jpg',
  '/dogs/terrier_park.jpg',
  '/dogs/wolf_hound.jpg',
];

const generateDogs = (page: number, limit: number): Dog[] => {
  const names = ['Luna', 'Max', 'Bella', 'Charlie', 'Lucy', 'Cooper', 'Bailey', 'Daisy', 'Rocky', 'Molly'];
  const descriptions = [
    'A gentle soul who loves cuddles and short walks',
    'An energetic buddy looking for an active family',
    'A mature dog who loves peaceful home life',
    'A playful pup who gets along with everyone'
  ];
  const traitCombinations = [
    [DogTrait.KID_FRIENDLY, DogTrait.LOW_ENERGY, DogTrait.GOOD_WITH_DOGS],
    [DogTrait.HIGH_ENERGY, DogTrait.NEEDS_TRAINING, DogTrait.OUTDOOR_ENTHUSIAST],
    [DogTrait.KID_FRIENDLY, DogTrait.HOUSE_TRAINED, DogTrait.CALM],
    [DogTrait.APARTMENT_FRIENDLY, DogTrait.GOOD_WITH_CATS, DogTrait.LOW_ENERGY]
  ];

  return Array.from({ length: limit }, (_, i) => {
    const id = (page - 1) * limit + i;
    return {
      id,
      name: names[id % names.length],
      age: Math.floor(Math.random() * 12 + 1),
      image: localImages[id % localImages.length],
      traits: traitCombinations[id % traitCombinations.length],
      description: descriptions[id % descriptions.length],
      compatibility: Math.floor(Math.random() * 30 + 70)
    };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const dogs = generateDogs(page, limit);

  return NextResponse.json(dogs);
}