'use client'

import DogSwiper from '@/components/DogSwiper';
import { useProfile } from '@/context/ProfileContext';
import { Dog, DogTrait } from '@/types';

const localImages = [
  '/dogs/big_ovcharka.jpg',
  '/dogs/jackson_derp.jpg',
  '/dogs/jackson_luci_fear.jpg',
  '/dogs/jackson_smile_on_rock.jpg',
  '/dogs/jackson_teefs.jpg',
  '/dogs/jackson_walking_bridge.jpg',
  '/dogs/luci_and_jackson_on_rock.jpg',
  '/dogs/luci_smile.jpg',
  '/dogs/luci_treat.jpg',
  '/dogs/luci_what.jpg',
  '/dogs/mystical_jackson.jpg',
  '/dogs/ninja_jackson.jpg',
  '/dogs/small_gangster.jpg',
  '/dogs/terrier_park.jpg',
  '/dogs/wolf_hound.jpg',
];

export default function Match() {
  const { profile } = useProfile();


  const calculateCompatibility = (dog: Dog): number => {
    if (!profile) return 80;
    let score = 0;
    let totalFactors = 0;

    // Lifestyle compatibility
    totalFactors++;
    if (
      (profile.lifestyle === 'active' && dog.traits.includes(DogTrait.HIGH_ENERGY)) ||
      (profile.lifestyle === 'relaxed' && dog.traits.includes(DogTrait.LOW_ENERGY)) ||
      (profile.lifestyle === 'moderate' && !dog.traits.includes(DogTrait.HIGH_ENERGY) && !dog.traits.includes(DogTrait.LOW_ENERGY))
    ) {
      score++;
    }

    // Home type compatibility
    totalFactors++;
    if (
      (profile.homeType === 'apartment' && dog.traits.includes(DogTrait.APARTMENT_FRIENDLY)) ||
      profile.homeType === 'house'
    ) {
      score++;
    }

    // Children compatibility
    totalFactors++;
    if (
      (profile.hasChildren && dog.traits.includes(DogTrait.KID_FRIENDLY)) ||
      !profile.hasChildren
    ) {
      score++;
    }

    // Other pets compatibility
    totalFactors++;
    if (
      (profile.hasPets && dog.traits.includes(DogTrait.GOOD_WITH_DOGS)) ||
      !profile.hasPets
    ) {
      score++;
    }

    // Experience level compatibility
    totalFactors++;
    if (
      (profile.experience === 'first-time' && !dog.traits.includes(DogTrait.NEEDS_TRAINING)) ||
      profile.experience === 'experienced' ||
      (profile.experience === 'some' && dog.traits.includes(DogTrait.HOUSE_TRAINED))
    ) {
      score++;
    }

    const baseScore = 70;
    const matchPercentage = (score / totalFactors) * 30;

    return Math.floor(baseScore + matchPercentage);
  };

  const generateDogs = (limit: number): Dog[] => {
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
      const id = i;
      const dogData = {
        id,
        name: names[id % names.length],
        age: Math.floor(Math.random() * 12 + 1),
        image: localImages[id % localImages.length],
        traits: traitCombinations[id % traitCombinations.length],
        description: descriptions[id % descriptions.length],
        compatibility: Math.floor(Math.random() * 30 + 70)
      };

      return {
        ...dogData,
        compatibility: calculateCompatibility(dogData)
      };

    });
  };

  const dogs = generateDogs(10)
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-screen h-screen p-4 overflow-hidden">
        <DogSwiper dogs={dogs}/>
      </div>
    </main>
  );
}