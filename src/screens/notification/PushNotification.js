/*
 * @Author: Gaoxuan
 * @Date:   2019-04-08 11:22:19
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PageContainer } from 'components';

import { Config, Theme, PxFit, Tools, SCREEN_WIDTH } from 'utils';

class PushNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation } = this.props;
		const { content, name, time } = navigation.state.params;

		return (
			<PageContainer title={name} white>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
						backgroundColor: '#fff',
						paddingTop: 25,
						paddingHorizontal: 15
					}}
				>
					<View style={{}}>
						<Image
							source={require('../../assets/images/logo.png')}
							style={{ width: 42, height: 42, borderRadius: 21 }}
						/>
					</View>
					<View style={{ paddingLeft: 10, width: SCREEN_WIDTH - 70 }}>
						<Text style={{ color: '#000', fontSize: 15, paddingTop: 2, fontWeight: '500' }}>
							{Config.AppName}官方团队
						</Text>
						<Text style={{ fontSize: 14, color: '#000', paddingTop: 8, lineHeight: 20 }}>{content}</Text>
						<Text style={{ fontSize: 12, color: Theme.grey, paddingTop: 15 }}>{time}</Text>
					</View>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default PushNotification;
