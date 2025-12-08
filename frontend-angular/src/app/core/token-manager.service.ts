import { Injectable } from '@angular/core';

export interface TokenValidation {
    isValid: boolean;
    reason: 'VALID' | 'EXPIRED' | 'NO_TOKEN' | 'INVALID_TOKEN';
    user?: any;
}

@Injectable({
    providedIn: 'root'
})
export class TokenManager {
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (token: string | null) => void;
        reject: (error: any) => void;
    }> = [];

    setToken(accessToken: string): void {
        localStorage.setItem('accessToken', accessToken);
    }

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    clearToken(): void {
        localStorage.removeItem('accessToken');
    }

    hasToken(): boolean {
        return !!this.getToken();
    }

    validateToken(token?: string): TokenValidation {
        const tokenToValidate = token || this.getToken();

        if (!tokenToValidate) {
            return { isValid: false, reason: 'NO_TOKEN' };
        }

        try {
            const user = this.getUserFromToken(tokenToValidate);
            if (!user?.exp) {
                return { isValid: false, reason: 'INVALID_TOKEN' };
            }

            const isExpired = Date.now() >= user.exp * 1000;
            if (isExpired) {
                return { isValid: false, reason: 'EXPIRED' };
            }

            return { isValid: true, user, reason: 'VALID' };
        } catch {
            return { isValid: false, reason: 'INVALID_TOKEN' };
        }
    }

    getUserFromToken(token?: string): any {
        const tokenToDecode = token || this.getToken();

        if (!tokenToDecode) {
            return null;
        }

        try {
            const payload = tokenToDecode.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch {
            return null;
        }
    }

    addToFailedQueue(resolve: (token: string | null) => void, reject: (error: any) => void): void {
        this.failedQueue.push({ resolve, reject });
    }

    processQueue(error: any = null, token: string | null = null): void {
        for (const promise of this.failedQueue) {
            if (error) {
                promise.reject(error);
            } else {
                promise.resolve(token);
            }
        }
        this.failedQueue = [];
    }

    setIsRefreshing(value: boolean): void {
        this.isRefreshing = value;
    }

    getIsRefreshing(): boolean {
        return this.isRefreshing;
    }
}