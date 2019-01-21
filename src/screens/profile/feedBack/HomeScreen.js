import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, TextInput, Image } from 'react-native';

import { Methods, Colors } from '../../../constants';

import { Button, DivisionLine, Header, TabBarHeader, Iconfont } from '../../../components';
import Screen from '../../Screen';
import FeedBack from './FeedBack';
import FeedBackList from './FeedBackList';

import { CreateFeedbackMutation } from '../../../graphql/user.graphql';
import { Mutation } from 'react-apollo';

import ImagePicker from 'react-native-image-crop-picker';
import ScrollableTabView from 'react-native-scrollable-tab-view';

const { width, height } = Dimensions.get('window');
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
						<FeedBack navigation={navigation} tabLabel="意见反馈" />
						<FeedBackList tabLabel="反馈记录" />
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
	},
	historyItem: {
		height: 100,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontSize: 16,
		lineHeight: 22,
		color: Colors.primaryFontColor
	},
	timeAgo: {
		fontSize: 13,
		color: Colors.lightFontColor
	}
});

export default HomeScreen;
