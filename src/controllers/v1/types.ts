export interface LinkAccountInput {
    access_token: string;
    id_token: string;
    refresh_token: string;
    provider: string;
    email: string;
    password: string;
    imap_host: string;
    imap_port: number;
    smtp_host: string;
    smtp_port: number;
}