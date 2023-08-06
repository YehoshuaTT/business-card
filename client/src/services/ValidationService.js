class Validations {
  static email(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static webAddress(website) {
    const websiteRegex = /^(https?:\/\/)?(www\.)?([^\s.]+\.)*[^\s]{2,}$/i;
    if (!website.match(/^https?:\/\//)) {
      website = "https://" + website;
    }
    return websiteRegex.test(website);
  }

  static phoneNumber(number) {
    const phoneNumberRegex = /^(0)?[2-9]\d{8}$/;
    return phoneNumberRegex.test(number);
  }
  static isEmpty(str) {
    return str ? str.trim().length === 0 : false;
  }
  static password(password) {
    /*Regex for high-security level password:
    (Minimum 8 characters, at least one uppercase letter,
    one lowercase letter, one digit, and one special character)*/

    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  }
}

export { Validations };
