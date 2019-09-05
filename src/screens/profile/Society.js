/*
 * @flow
 * created by wyk made in 2019-03-22 14:00:05
 */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, NavigatorBar, ScrollTabBar } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, NAVBAR_HEIGHT } from 'utils';
import Following from './components/Following';
import Follower from './components/Follower';
import ScrollableTabView from 'react-native-scrollable-tab-view';

class Society extends Component {
	render() {
		let { navigation } = this.props;
		let follower = navigation.getParam('follower');
		return (
			<PageContainer hiddenNavBar contentViewStyle={{ marginTop: Theme.statusBarHeight }}>
				<ScrollableTabView
					initialPage={follower ? 1 : 0}
					renderTabBar={props => <ScrollTabBar {...props} tabUnderlineWidth={PxFit(30)} />}
				>
					<Following tabLabel="关注" navigation={navigation} />
					<Follower tabLabel="粉丝" navigation={navigation} />
				</ScrollableTabView>
				<View style={styles.backButton}>
					<TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
						<Iconfont name="left" color={Theme.defaultTextColor} size={PxFit(21)} />
					</TouchFeedback>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	backButton: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: Theme.navBarContentHeight,
		height: Theme.navBarContentHeight,
		justifyContent: 'center',
		paddingLeft: PxFit(Theme.itemSpace)
	}
});

export default Society;
