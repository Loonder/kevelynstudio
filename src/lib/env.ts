/**
 * Environment Variable Validation
 * This file checks for required environment variables and ensures sensitive keys are not exposed.
 */

const requiredServerEnvVars = [
    "DATABASE_URL",
    "DIRECT_URL",
    // "SUPABASE_SERVICE_ROLE_KEY", // Uncomment if/when used
];

const requiredPublicEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
];

export function validateEnv() {
    const isServer = typeof window === 'undefined';
    const missing: string[] = [];

    // Check Public Vars (Client & Server)
    requiredPublicEnvVars.forEach(key => {
        if (!process.env[key]) {
            missing.push(key);
        }
    });

    // Check Server Vars (Server Only)
    if (isServer) {
        requiredServerEnvVars.forEach(key => {
            if (!process.env[key]) {
                missing.push(key);
            }
        });

        // Security Check: Ensure no server keys start with NEXT_PUBLIC_
        requiredServerEnvVars.forEach(key => {
            if (key.startsWith("NEXT_PUBLIC_")) {
                throw new Error(`SECURITY ALERT: Sensitive key ${key} must NOT start with NEXT_PUBLIC_.`);
            }
        });
    }

    if (missing.length > 0) {
        throw new Error(
            `❌ Missing Environment Variables:\n` +
            missing.join("\n") +
            `\n\nPlease check your .env file.`
        );
    }

    console.log("✅ Environment Variables Validated");
}

// Auto-run validation in development
if (process.env.NODE_ENV === 'development') {
    validateEnv();
}
