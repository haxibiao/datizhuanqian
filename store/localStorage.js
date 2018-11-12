import { AsyncStorage } from "react-native";

export const ItemKeys = {
  user: "user",
  categories: "categories"
};

async function removeItem(key) {
  return await AsyncStorage.removeItem(key);
}

async function setItem(key, value) {
  return await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getItem(key) {
  let results = await AsyncStorage.getItem(key);

  try {
    return JSON.parse(results);
  } catch (e) {
    return null;
  }
}

async function clearAll() {
  return AsyncStorage.clear();
}

export const Storage = {
  removeItem,
  getItem,
  setItem,
  clearAll
};
