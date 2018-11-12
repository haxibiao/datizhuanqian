import types from "../types";

export default {
  signIn(user) {
    return {
      type: types.SIGN_IN,
      user
    };
  },

  signOut() {
    return {
      type: types.SIGN_OUT
    };
  }
};
