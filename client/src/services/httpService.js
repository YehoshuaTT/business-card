import axios from "axios";

const baseUrl = "http://localhost:4000";
class HttpService {
  static async login(registerOrLogin, user) {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/${registerOrLogin}/`,
        user
      );
      if (response.status === 200) return true;
    } catch (error) {
      if (error.response.data === "user already exists in the system")
        return error.response.data;
      return false;
    }
  }

  static async autorized() {
    try {
      const { data } = await axios.post(`${baseUrl}/auth/loggedcheck`);
      if (data) return data;
      else return null;
    } catch (error) {
      return false;
    }
  }
}
class BusinessCardService {
  static async index() {
    try {
      const { data } = await axios.get(`${baseUrl}/businesscards/`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async Show(businessCardId) {
    try {
      const { data } = await axios.get(
        `${baseUrl}/businesscards/${businessCardId}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async create(businessCardInfo) {
    try {
      const { data } = await axios.post(
        `${baseUrl}/businesscards`,
        businessCardInfo
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async update(businessCardId, update) {
    try {
      const { data } = await axios.put(
        `${baseUrl}/businesscards/${businessCardId}`,
        update
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(businessCardId) {
    try {
      const { data } = await axios.delete(
        `${baseUrl}/businesscards/${businessCardId}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  static async upload(businessCardId, image) {
    try {
      if (
        await axios.put(
          `${baseUrl}/businesscards/upload/${businessCardId}`,
          image
        )
      )
        return true;
    } catch (error) {
      console.log(error);
    }
  }
}
export { BusinessCardService, HttpService };
