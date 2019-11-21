import AsyncStorage from '@react-native-community/async-storage';

export const keys = {
	me: 'me',
	user: 'user',
	contributeRuleRead: 'contributeRuleRead',
	viewedVersion: 'viewedVersion',
	resetVersion: 'resetVersion',
	commentAppStoreVersion: 'commentAppStoreVersion',
	categoryCache: 'categoryCache',
	taskCache: 'taskCache',
	userCache: 'userCache',
	withdrawTips: 'withdrawTips',
	firstReadSpiderVideoTask: 'firstReadSpiderVideoTask',
	firstOpenVideoOperation: 'firstOpenVideoOperation',
	BeginnerGuidance_VideoTask: 'BeginnerGuidance_VideoTask',
	BeginnerGuidance_Answer: 'BeginnerGuidance_Answer',
	BeginnerGuidance_InputQuestion: 'BeginnerGuidance_InputQuestion',
	BeginnerGuidance_SubmitQuestion: 'BeginnerGuidance_SubmitQuestion',
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

export const storage = {
	removeItem,
	getItem,
	setItem,
	clearAll,
};
