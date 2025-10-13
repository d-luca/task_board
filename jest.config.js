/** @type {import('jest').Config} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"^@renderer/(.*)$": "<rootDir>/src/renderer/src/$1",
		"^@main/(.*)$": "<rootDir>/src/main/$1",
		"^@preload/(.*)$": "<rootDir>/src/preload/$1",
		"^src/renderer/src/(.*)$": "<rootDir>/src/renderer/src/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/renderer/src/main.tsx",
		"!src/main/index.ts",
		"!src/preload/index.ts",
		"!src/**/__tests__/**",
		"!src/**/node_modules/**",
	],
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov", "html"],
	testTimeout: 10000,
	transformIgnorePatterns: ["node_modules/(?!(mongodb-memory-server|bson|mongodb)/)"],
	globals: {
		"ts-jest": {
			tsconfig: {
				jsx: "react-jsx",
				esModuleInterop: true,
				allowSyntheticDefaultImports: true,
			},
		},
	},
};
