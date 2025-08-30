const cookies = {
  /**
   * @param {any} value - value
   * @returns {string} validated string
   * @throws {TypeError}
   */
  checkValueType: (value) => {
    if (typeof value !== "string") throw new TypeError("Invalid value type");
    return value;
  },

  /**
   * @param {string} name
   * @returns {string|null} cookie value or null if not found
   */
  getCookie: (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  },

  /**
   * @param {string} name
   * @param {string} value
   * @param {number} days
   * @returns {string} cookie string
   */
  setCookie: (name, value, days) => {
    cookies.checkValueType(value);
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    const cookieStr = `${name}=${value || ""}${expires}; path=/`;
    document.cookie = cookieStr;
    return cookieStr;
  },

  /**
   * @param {string} name
   */
  deleteCookie: (name) => {
    cookies.setCookie(name, "", -1);
  },
};

export default cookies;
