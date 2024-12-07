export enum DogTrait {
    KID_FRIENDLY = 'KID_FRIENDLY',
    HIGH_ENERGY = 'HIGH_ENERGY',
    LOW_ENERGY = 'LOW_ENERGY',
    HOUSE_TRAINED = 'HOUSE_TRAINED',
    NEEDS_TRAINING = 'NEEDS_TRAINING',
    GOOD_WITH_DOGS = 'GOOD_WITH_DOGS',
    GOOD_WITH_CATS = 'GOOD_WITH_CATS',
    APARTMENT_FRIENDLY = 'APARTMENT_FRIENDLY',
    OUTDOOR_ENTHUSIAST = 'OUTDOOR_ENTHUSIAST',
    SENIOR_FRIENDLY = 'SENIOR_FRIENDLY',
    SPECIAL_NEEDS = 'SPECIAL_NEEDS',
    CALM = 'CALM'
}

export const DogTraitDisplay: Record<DogTrait, string> = {
    [DogTrait.KID_FRIENDLY]: 'Kid Friendly',
    [DogTrait.HIGH_ENERGY]: 'High Energy',
    [DogTrait.LOW_ENERGY]: 'Low Energy',
    [DogTrait.HOUSE_TRAINED]: 'House Trained',
    [DogTrait.NEEDS_TRAINING]: 'Needs Training',
    [DogTrait.GOOD_WITH_DOGS]: 'Good with Dogs',
    [DogTrait.GOOD_WITH_CATS]: 'Good with Cats',
    [DogTrait.APARTMENT_FRIENDLY]: 'Apartment Friendly',
    [DogTrait.OUTDOOR_ENTHUSIAST]: 'Outdoor Enthusiast',
    [DogTrait.SENIOR_FRIENDLY]: 'Senior Friendly',
    [DogTrait.SPECIAL_NEEDS]: 'Special Needs',
    [DogTrait.CALM]: 'Calm'
};

export interface Dog {
    id: number;
    name: string;
    age: number;
    image: string;
    traits: DogTrait[];
    description: string;
    compatibility: number;
}

// Helper function to get icon based on trait
export const getTraitIcon = (trait: DogTrait) => {
    switch (trait) {
        case DogTrait.KID_FRIENDLY:
            return 'Baby';
        case DogTrait.HIGH_ENERGY:
        case DogTrait.LOW_ENERGY:
            return 'Dumbbell';
        case DogTrait.HOUSE_TRAINED:
        case DogTrait.APARTMENT_FRIENDLY:
            return 'Home';
        case DogTrait.GOOD_WITH_DOGS:
        case DogTrait.GOOD_WITH_CATS:
            return 'PawPrint';
        case DogTrait.OUTDOOR_ENTHUSIAST:
            return 'Sun';
        case DogTrait.SENIOR_FRIENDLY:
        case DogTrait.SPECIAL_NEEDS:
            return 'Heart';
        case DogTrait.CALM:
            return 'Coffee';
        default:
            return 'Paw';
    }
};