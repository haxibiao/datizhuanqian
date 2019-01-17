import types from '../types';

export default {
  signIn(user) {
    return {
      type: types.SIGN_IN,
      user
    };
  },

  setUser(user) {
    let newUser = user ? user : {};
    return {
      type: types.SET_USER,
      user: newUser
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
  },
  updateGold(gold) {
    return {
      type: types.UPDATE_GOLD,
      gold
    };
  },

  recordOperation(noTicketTips) {
    return {
      type: types.RECORD_OPERATION,
      noTicketTips
    };
  },
  //用户账号状态
  cancelUpdate(isUpdate) {
    return {
      type: types.CANCEL_UPDATE,
      isUpdate
    };
  },
  updateVersion(version) {
    return {
      type: types.UPDATE_VERSION,
      version
    };
  },
  //localstorge APP状态

  userCache(user) {
    return {
      type: types.USER_CACHE,
      user
    };
  },
  categoryCache(categories) {
    return {
      type: types.CATEGORY_CACHE,
      categories
    };
  }
  //本地网络缓存
};