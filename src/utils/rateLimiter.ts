// Simple rate limiter to control API request frequency
class RateLimiter {
  private lastRequestTime: number = 0;
  private requestQueue: (() => void)[] = [];
  private isProcessing: boolean = false;
  private readonly MIN_INTERVAL = 2000; // 2 seconds between requests

  async waitForNextRequest(): Promise<void> {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const waitTime = Math.max(0, this.MIN_INTERVAL - timeSinceLastRequest);

    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    const nextRequest = this.requestQueue.shift();
    if (nextRequest) {
      this.lastRequestTime = Date.now();
      nextRequest();
    }

    this.isProcessing = false;
    this.processQueue();
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter(); 