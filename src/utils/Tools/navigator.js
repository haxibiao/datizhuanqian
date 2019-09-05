/*
 * @flow
 * created by wyk made in 2019-02-02 09:25:09
 */
export function contentNavigator({ type, ...params }, navigation) {
	switch (type) {
		case 'article':
			navigation.navigate('Article', { article: params });
			break;
		case 'video':
			navigation.navigate('VideoPost', { video: params });
			break;
		case 'post':
			navigation.navigate('Post', { post: params });
			break;
	}
}
