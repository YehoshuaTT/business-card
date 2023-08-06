import axios from "axios";

class HttpService {
  static async login(registerOrLogin, user) {
    try {
      const response = await axios.post(`/auth/${registerOrLogin}/`, user);
      if (response.status === 200) return true;
    } catch (error) {
      if (error.response.data === "user already exists in the system")
        return error.response.data;
      return false;
    }
  }

  static async autorized() {
    try {
      const { data } = await axios.post(`/auth/loggedcheck`);
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
      const { data } = await axios.get(`/businesscards/`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async Show(businessCardId) {
    try {
      const { data } = await axios.get(`/businesscards/${businessCardId}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async create(businessCardInfo) {
    try {
      const { data } = await axios.post(`/businesscards`, businessCardInfo);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async update(businessCardId, update) {
    try {
      const { data } = await axios.put(
        `/businesscards/${businessCardId}`,
        update
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(businessCardId) {
    try {
      const { data } = await axios.delete(`/businesscards/${businessCardId}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  static async upload(businessCardId, image) {
    try {
      if (await axios.put(`/businesscards/upload/${businessCardId}`, image))
        return true;
    } catch (error) {
      console.log(error);
    }
  }
}
export { BusinessCardService, HttpService };
