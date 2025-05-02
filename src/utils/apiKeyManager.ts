// API key manager with round-robin implementation
export class ApiKeyManager {
  private apiKeys: string[];
  private currentIndex: number;

  constructor(apiKeys: string[]) {
    if (!apiKeys || apiKeys.length === 0) {
      throw new Error("At least one API key is required");
    }
    this.apiKeys = apiKeys;
    this.currentIndex = 0;
  }

  getNextKey(): string {
    const key = this.apiKeys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
    return key;
  }

  getCurrentKey(): string {
    return this.apiKeys[this.currentIndex];
  }
}

// Initialize with your API keys
const apiKeys = [
  import.meta.env.VITE_COINGECKO_API_KEY_1 || "",
  import.meta.env.VITE_COINGECKO_API_KEY_2 || "",
  import.meta.env.VITE_COINGECKO_API_KEY_3 || "",
].filter(key => key); // Remove empty keys

if (apiKeys.length === 0) {
  console.warn("No valid API keys found. Please check your environment variables.");
}

export const apiKeyManager = new ApiKeyManager(apiKeys); 