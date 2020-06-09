import { Photo } from './photo';

// Typescript interface
export interface User {
    // Required user properties
    id: number;
    username: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;

    // Optional properties
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}
