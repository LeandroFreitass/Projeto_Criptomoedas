describe("Primitive values", () => {
  it("should test jest assertions", () => {
    const number = 10;
    expect(number).toBe(10);
    expect(number).toEqual(10);

    expect(number).toBeGreaterThanOrEqual(10);
  });
});

describe("Objects", () => {
  it("should test jest assertions with objects", () => {
    const namecompleto = { name: "Leandro", age: 30 };
    const names = { ...namecompleto };

    expect(names).toHaveProperty("name", "Leandro");
    expect(namecompleto.name).toBe("Leandro");
  });
});
