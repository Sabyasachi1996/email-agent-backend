//will be separated later
export interface NewCreatedUserWithAccount {
    id:string;
    name:string;
    email:string;
    phone:string|null;
    createdAt:Date;
}
export interface UserCreateDataset {
    name:string;
    email:string;
    password:string;
    phone?:string|null;
    emailAccounts:{
        create:{
            emailAddress:string;
        }
    }
}