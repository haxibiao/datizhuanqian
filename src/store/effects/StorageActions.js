import actions from '../actions';
import types from '../types';
import { Storage, ItemKeys } from '../localStorage';

export async function rememberUser({ action, getState, dispatch }) {
	let store = getState();
	let { isUpdate } = action;

	await Storage.setItem(ItemKeys.user, store.users.user);
	if (isUpdate) {
		await Storage.setItem(ItemKeys.isUpdate, true);
	}
}

export async function rememberVersion({ action, getState, dispatch }) {
	let { version } = action;
	await Storage.setItem(ItemKeys.version, version);
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