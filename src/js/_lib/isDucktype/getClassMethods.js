export default function getClassMethods(clazz) {
  const methods = new Set();
  let proto = clazz.prototype;

  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto)
      .filter(
        (name) => typeof proto[name] === "function" && name !== "constructor",
      )
      .forEach((name) => methods.add(name));
    proto = Object.getPrototypeOf(proto);
  }

  return Array.from(methods);
}
