module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	testMatch: ["**/*.test.ts"],
	testPathIgnorePatterns: ["node_modules", "dist"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["node_modules", "dist"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
};
