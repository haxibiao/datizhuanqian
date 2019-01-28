import actions from '../actions';
import types from '../types';
import { Storage, ItemKeys } from '../localStorage';

export async function rememberUser({ action, getState, dispatch }) {
	let store = getState();
	await Storage.setItem(ItemKeys.user, store.users.user);
}

export async function appIntroVersion({ action, getState, dispatch }) {
	let { appIntroVersion } = action;
	await Storage.setItem(ItemKeys.appIntroVersion, appIntroVersion);
}

export async function updateTipsVersion({ action, getState, dispatch }) {
	let { updateTipsVersion } = action;
	await Storage.setItem(ItemKeys.updateTipsVersion, updateTipsVersion);
}

export async function rememberUserCache({ action, getState, dispatch }) {
	let { user } = action;
	await Storage.setItem(ItemKeys.userCache, user);
}

export async function rememberCategoryCache({ action, getState, dispatch }) {
	let { categories } = action;
	await Storage.setItem(ItemKeys.categoryCache, categories);
}

export async function forgetUser({ action, getState, dispatch }) {
	await Storage.removeItem(ItemKeys.user);
	await Storage.removeItem(ItemKeys.userCache);

	// await Storage.removeItem(ItemKeys.isUpdate);
}
