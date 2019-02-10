import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { Colors } from '../../constants';
import { Methods } from '../../helpers';

import { TabBarHeader, Screen } from '../../components';

import Feedback from './Feedback';
import FeedbackList from './FeedbackList';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation } = this.props;
		return (
			<Screen header>
				<View style={styles.container}>
					<ScrollableTabView renderTabBar={props => <TabBarHeader {...props} width={300} />}>
						<Feedback navigation={navigation} tabLabel="意见反馈" />
						<FeedbackList navigation={navigation} tabLabel="反馈记录" />
					</ScrollableTabView>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default HomeScreen;
