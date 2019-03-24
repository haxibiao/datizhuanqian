/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:07
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { Theme, SCREEN_WIDTH, PxFit } from '../../utils';

import { TabBarHeader, PageContainer, ScrollTabBarHeader } from '../../components';

import Feedback from './components/Feedback';
import FeedbackList from './components/FeedbackList';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation } = this.props;
		return (
			<PageContainer hiddenNavBar>
				<View style={styles.container}>
					<ScrollableTabView
						renderTabBar={props => (
							<ScrollTabBarHeader
								{...props}
								width={SCREEN_WIDTH - 100}
								underLineColor={Theme.theme}
								textStyle={{ fontSize: PxFit(15) }}
							/>
						)}
					>
						<FeedbackList navigation={navigation} tabLabel="反馈记录" />
						<Feedback navigation={navigation} tabLabel="提交反馈" />
					</ScrollableTabView>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white
	},
	header: {
		// paddingTop: Divice.STATUSBAR_HEIGHT,
		// height: Divice.STATUSBAR_HEIGHT + 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Theme.white
	},
	goBack: {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		width: 40,
		height: 40,
		bottom: 0,
		left: 15
	}
});

export default index;
