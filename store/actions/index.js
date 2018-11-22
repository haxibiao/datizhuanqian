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
  },
  updateAvatar(avatar, timestamp) {
    return {
      type: types.UPDATE_AVATAR,
      avatar,
      timestamp
    };
  },

  updateName(name) {
    return {
      type: types.UPDATE_NAME,
      name
    };
  }
};
