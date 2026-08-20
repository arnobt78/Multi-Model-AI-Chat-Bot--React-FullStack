/**
 * Barrel exports for shared AI modules (server + client-safe metadata/types).
 * Client must not import orchestrate.ts (uses process.env secrets).
 */
export * from "./types";
export * from "./providers";
export * from "./schemas";
