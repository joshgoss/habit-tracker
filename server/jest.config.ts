export default {
	globalTeardown: "./scripts/jestGlobalTeardown.ts",
	preset: "ts-jest",
	testEnvironment: "node",
	testPathIgnorePatterns: ["/node_modules/"],
};
