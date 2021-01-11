module.exports = {
    "*.{ts,tsx}": ["prettier --write", () => 'tsc -p . --noEmit'],
};