export interface User {
    id?: string;
    likedArticles?: string[];
    onboarded?: boolean;
    centralized?: boolean;
    key_addresses?: string[];
    recovery_addresses?: string[];
    identity_address?: string;
}