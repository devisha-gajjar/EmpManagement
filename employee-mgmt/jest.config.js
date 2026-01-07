export const testEnvironment = 'jsdom';
export const transform = {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
};
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.ts'];
export const moduleFileExtensions = ['js', 'jsx', 'ts', 'tsx', 'json'];
export const moduleNameMapper = {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
};
