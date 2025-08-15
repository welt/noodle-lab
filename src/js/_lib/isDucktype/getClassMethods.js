export default function getClassMethods(clazz) {
  return Object.getOwnPropertyNames(clazz.prototype).filter(
    (name) =>
      typeof clazz.prototype[name] === "function" && name !== "constructor",
  );
}
