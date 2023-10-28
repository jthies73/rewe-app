import { generateDateFileName } from "./stringUtils";

describe("Sample Test File", () => {
	it("Should return Hello World", () => {
		const name = generateDateFileName(new Date());
		expect(name).not.toBe(null);
	});
});
