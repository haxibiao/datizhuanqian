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
  updateAvatar(avatar) {
    return {
      type: types.UPDATE_AVATAR,
      avatar
    };
  },

  updateName(name) {
    return {
      type: types.UPDATE_NAME,
      name
    };
  },
  updateAlipay(account) {
    return {
      type: types.UPDATE_ALIPAY,
      account
    };
  }
};
