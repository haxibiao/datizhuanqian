/*
 * @Author: Gaoxuan
 * @Date:   2019-05-24 14:04:38
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	FlatList,
	Image,
	Dimensions,
	ScrollView,
	Linking
} from 'react-native';
import { PageContainer, TouchFeedback, PullChooser, Iconfont } from 'components';
import { Theme, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, NAVBAR_HEIGHT, Config } from 'utils';

import { compose, withApollo, GQL } from 'apollo';

class Recruit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0.1
		};
	}

	render() {
		const { navigation, client } = this.props;
		let { progress } = this.state;

		return (
			<PageContainer white title={'版主招募'}>
				<ScrollView style={{ flex: 1 }}>
					<Image
						source={require('../../assets/images/recruit1.jpg')}
						style={{
							width: SCREEN_WIDTH,
							height: (SCREEN_WIDTH * 1920) / 1080
						}}
					/>
					<Image
						source={require('../../assets/images/recruit2.jpg')}
						style={{
							width: SCREEN_WIDTH,
							height: (SCREEN_WIDTH * 1920) / 1080
						}}
					/>
					<Image
						source={require('../../assets/images/recruit3.jpg')}
						style={{
							width: SCREEN_WIDTH,
							height: (SCREEN_WIDTH * 1920) / 1080
						}}
					/>
					<Image
						source={require('../../assets/images/recruit4.jpg')}
						style={{
							width: SCREEN_WIDTH,
							height: (SCREEN_WIDTH * 1920) / 1080
						}}
					/>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	optionsButton: {
		flex: 1,
		width: PxFit(40),
		alignItems: 'flex-end',
		justifyContent: 'center'
	}
});

export default Recruit;
