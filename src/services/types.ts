export interface UserProfileData {    
    id: string;
    email: string;
    name: string;
    phone: string | null;
    isActive: boolean;
    createdAt: Date;   
}