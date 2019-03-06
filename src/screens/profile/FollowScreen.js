/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 15:01:01
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { TabBarHeader, Screen } from '../../components';
import { Colors } from '../../constants';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class FollowScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation } = this.props;
		return (
			<Screen header>
				<View style={styles.container}>
					<ScrollableTabView renderTabBar={props => <TabBarHeader {...props} width={300} />} initialPage={1}>
						<Follow navigation={navigation} tabLabel="关注" />
						<Fans navigation={navigation} tabLabel="粉丝" />
					</ScrollableTabView>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default FollowScreen;
