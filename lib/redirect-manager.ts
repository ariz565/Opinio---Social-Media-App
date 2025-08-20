// Global redirect state management to prevent infinite loops
let isRedirecting = false;
let redirectTimeout: NodeJS.Timeout | null = null;

export const setRedirectingState = (state: boolean) => {
  isRedirecting = state;

  if (state) {
    // Clear any existing timeout
    if (redirectTimeout) {
      clearTimeout(redirectTimeout);
    }

    // Auto-reset after 2 seconds as a safety measure
    redirectTimeout = setTimeout(() => {
      isRedirecting = false;
    }, 2000);
  }
};

export const isCurrentlyRedirecting = () => isRedirecting;

export const clearRedirectState = () => {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout);
    redirectTimeout = null;
  }
  isRedirecting = false;
};
