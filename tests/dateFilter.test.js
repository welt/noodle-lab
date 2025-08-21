import dateFilter from "../scripts/dateFilter.js";

describe("dateFilter", () => {
  it("returns UTC format for 'utc'", () => {
    const result = dateFilter("2024-06-04T12:34:56Z", "utc");
    expect(result).toBe("Tue, 04 Jun 2024 12:34:56 GMT");
  });

  it("returns ISO format for 'iso'", () => {
    const result = dateFilter("2024-06-04T12:34:56Z", "iso");
    expect(result).toBe("2024-06-04T12:34:56.000Z");
  });

  it("throws on unsupported format", () => {
    expect(() => dateFilter("2024-06-04T12:34:56Z", "foo")).toThrow(
      /Unsupported date format/,
    );
  });
});
