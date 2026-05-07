/**
 * Environment Variable Validation
 * Ensures all required environment variables are present and valid
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required public variables
  const requiredPublic = {
    NEXT_PUBLIC_ZG_CHAIN_ID: process.env.NEXT_PUBLIC_ZG_CHAIN_ID,
    NEXT_PUBLIC_ZG_RPC_URL: process.env.NEXT_PUBLIC_ZG_RPC_URL,
  };

  // Required server variables
  const requiredServer = {
    DATABASE_URL: process.env.DATABASE_URL,
    AI_API_KEY: process.env.AI_API_KEY,
  };

  // Check required public variables
  Object.entries(requiredPublic).forEach(([key, value]) => {
    if (!value) {
      errors.push(`Missing required public environment variable: ${key}`);
    }
  });

  // Check required server variables
  Object.entries(requiredServer).forEach(([key, value]) => {
    if (!value) {
      errors.push(`Missing required server environment variable: ${key}`);
    }
  });

  // Validate chain ID
  const chainId = Number(process.env.NEXT_PUBLIC_ZG_CHAIN_ID);
  if (process.env.NEXT_PUBLIC_ZG_CHAIN_ID && isNaN(chainId)) {
    errors.push("NEXT_PUBLIC_ZG_CHAIN_ID must be a valid number");
  } else if (chainId !== 16602) {
    warnings.push(
      `NEXT_PUBLIC_ZG_CHAIN_ID is ${chainId}, expected 16602 for 0G Newton Testnet`
    );
  }

  // Validate contract addresses
  const contractVars = [
    "NEXT_PUBLIC_SIFIX_CONTRACT",
    "NEXT_PUBLIC_FLOW_CONTRACT",
  ] as const;
  for (const varName of contractVars) {
    const address = process.env[varName];
    if (address && !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      errors.push(`${varName} must be a valid Ethereum address`);
    }
  }

  // Validate RPC URL format
  if (process.env.NEXT_PUBLIC_ZG_RPC_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_ZG_RPC_URL);
    } catch {
      errors.push("NEXT_PUBLIC_ZG_RPC_URL must be a valid URL");
    }
  }

  // Optional variables with defaults
  const optionalWithDefaults = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "SIFIX",
    AI_MODEL: process.env.AI_MODEL || "glm/glm-5.1",
    AI_BASE_URL: process.env.AI_BASE_URL || "http://43.156.177.86:20128/v1",
  };

  // Warn about sensitive data in public variables
  if (process.env.NEXT_PUBLIC_PRIVATE_KEY || process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY) {
    errors.push(
      "SECURITY WARNING: Never expose private keys in public environment variables!"
    );
  }

  // Validate that we're not using example values
  if (process.env.AI_API_KEY?.includes("example") || process.env.AI_API_KEY?.includes("your_")) {
    warnings.push("AI_API_KEY appears to be using example/placeholder value");
  }

  const result: EnvValidationResult = {
    isValid: errors.length === 0,
    errors,
    warnings,
  };

  // Log results in development
  if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
    if (errors.length > 0) {
      console.error("❌ Environment validation failed:");
      errors.forEach((error) => console.error(`  - ${error}`));
    }
    if (warnings.length > 0) {
      console.warn("⚠️  Environment warnings:");
      warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }
    if (errors.length === 0 && warnings.length === 0) {
      console.log("✅ Environment validation passed");
    }
  }

  return result;
}

/**
 * Validate environment and throw if invalid
 */
export function validateEnvOrThrow(): void {
  const result = validateEnv();
  if (!result.isValid) {
    throw new Error(
      `Environment validation failed:\n${result.errors.join("\n")}`
    );
  }
}