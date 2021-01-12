module.exports = {
    "*.{ts,tsx}": ["prettier --write", () => 'tsc -p . --noEmit'],
    "../api/**/*.{ts,tsx}": ["prettier --write", () => 'tsc -p ../api --noEmit'],
};