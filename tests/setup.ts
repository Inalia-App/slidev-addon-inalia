// Setup file for Vitest tests
// Provides necessary DOM polyfills for jsdom environment

// IntersectionObserver polyfill for components that may observe element visibility
// @ts-expect-error - incomplete implementation
window.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// ResizeObserver polyfill for components that may observe element size changes
window.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
