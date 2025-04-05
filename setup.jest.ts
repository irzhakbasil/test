import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import '@testing-library/jest-dom';
import 'whatwg-fetch'; // This adds fetch, Request, Response, etc. polyfills

// Add global fetch API polyfills needed for MSW
global.Response = Response;
global.Request = Request;
global.Headers = Headers;

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
global.BroadcastChannel = mockBroadcastChannel as unknown as typeof BroadcastChannel;

setupZoneTestEnv();
