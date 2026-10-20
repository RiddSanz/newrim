// Portable npm start entrypoint: preserve development-mode behavior on Android/Linux/Windows.
process.env.NODE_ENV = "development";
await import("./index.js");
