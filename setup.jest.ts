import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';
import 'whatwg-fetch'; // This adds fetch, Request, Response, etc. polyfills

// Add global fetch API polyfills needed for MSW
(globalThis as any).Response = Response;
(globalThis as any).Request = Request;
(globalThis as any).Headers = Headers;

// Mock BroadcastChannel (required by MSW)
const mockBroadcastChannel = {
  new: function(name: string) {
    return {
      name,
      onmessage: null,
      onmessageerror: null,
      postMessage: () => {},
      close: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    };
  },
  prototype: {
    name: '',
    onmessage: null,
    onmessageerror: null,
    postMessage: () => {},
    close: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
  }
};

// Set the global BroadcastChannel to our mock implementation
(globalThis as any).BroadcastChannel = mockBroadcastChannel as unknown as typeof BroadcastChannel;

setupZoneTestEnv();
