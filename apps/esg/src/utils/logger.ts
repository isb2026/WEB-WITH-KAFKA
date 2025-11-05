// Enhanced logging utility for auth system

interface LogContext {
    component?: string;
    action?: string;
    userId?: string;
    sessionId?: string;
    [key: string]: any;
}

class AuthLogger {
    private isDevelopment = import.meta.env.DEV;
    private isDebugEnabled = import.meta.env.VITE_DEBUG_AUTH === 'true';

    private formatMessage(level: string, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
        return `[${timestamp}] [AUTH-${level}] ${message}${contextStr}`;
    }

    private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
        if (level === 'debug') {
            return this.isDevelopment && this.isDebugEnabled;
        }
        return this.isDevelopment || level === 'error';
    }

    debug(message: string, context?: LogContext): void {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('DEBUG', message, context));
        }
    }

    info(message: string, context?: LogContext): void {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('INFO', message, context));
        }
    }

    warn(message: string, context?: LogContext): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('WARN', message, context));
        }
    }

    error(message: string, error?: any, context?: LogContext): void {
        if (this.shouldLog('error')) {
            const errorInfo = error ? {
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
                status: error?.response?.status,
                statusText: error?.response?.statusText
            } : undefined;

            const fullContext = { ...context, error: errorInfo };
            console.error(this.formatMessage('ERROR', message, fullContext));
        }
    }

    // Auth-specific logging methods
    authStateChange(from: string, to: string, reason?: string): void {
        this.info(`Auth state changed: ${from} → ${to}`, {
            from,
            to,
            reason,
            component: 'AuthStateManager'
        });
    }

    cookieStateChange(hasCookie: boolean, source: string): void {
        this.debug(`Cookie state: ${hasCookie ? 'present' : 'absent'}`, {
            hasCookie,
            source,
            component: 'CookieMonitor'
        });
    }

    serverAuthCheck(success: boolean, duration: number, error?: any): void {
        if (success) {
            this.debug(`Server auth check successful (${duration}ms)`, {
                duration,
                component: 'ServerAuthCheck'
            });
        } else {
            this.warn(`Server auth check failed (${duration}ms)`, {
                duration,
                error: error?.message,
                component: 'ServerAuthCheck'
            });
        }
    }

    loginAttempt(email: string, success: boolean, error?: any): void {
        const safeEmail = this.isDevelopment ? email : email.replace(/(.{2}).*(@.*)/, '$1***$2');

        if (success) {
            this.info(`Login successful for ${safeEmail}`, {
                email: safeEmail,
                component: 'LoginMutation'
            });
        } else {
            this.error(`Login failed for ${safeEmail}`, error, {
                email: safeEmail,
                component: 'LoginMutation'
            });
        }
    }

    logoutAttempt(success: boolean, error?: any): void {
        if (success) {
            this.info('Logout successful', { component: 'LogoutMutation' });
        } else {
            this.error('Logout failed', error, { component: 'LogoutMutation' });
        }
    }
}

export const authLogger = new AuthLogger();