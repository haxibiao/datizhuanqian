/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:52:05
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated } from 'react-native';
import { TouchFeedback, Avatar, Button } from 'components';
import { PxFit, Theme, SCREEN_WIDTH, SCREEN_HEIGHT, Config } from 'utils';

import { Overlay } from 'teaset';

class UserInfo extends Component {
	showRewordRule = (shieldingAd, category) => {
		let overlayView = (
			<Overlay.View animated>
				<View style={styles.overlayInner}>
					<View
						style={{
							width: SCREEN_WIDTH - PxFit(70),
							paddingHorizontal: PxFit(25),
							paddingVertical: PxFit(20),
							borderRadius: PxFit(15),
							backgroundColor: '#fff'
						}}
					>
						<Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(16), textAlign: 'center' }}>
							免广告服务
						</Text>

						<View style={{ marginVertical: 15 }}>
							<Text>{`您已购买${category.name}免广告服务`}</Text>
							<Text style={{ paddingTop: 5 }}>{`免广告服务到期时间：${shieldingAd}`}</Text>
							<Text style={{ paddingTop: 5 }}>{`感谢您对${Config.AppName}的支持`}</Text>
						</View>
						<Button
							title={'确定'}
							onPress={() => Overlay.hide(this.OverlayKey)}
							style={styles.buttonText}
						/>
					</View>
				</View>
			</Overlay.View>
		);
		this.OverlayKey = Overlay.show(overlayView);
	};

	render() {
		const {
			question: { user },
			navigation,
			shieldingAd,
			category
		} = this.props;
		if (user.id == 1) {
			return null;
		}

		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<TouchFeedback style={styles.userItem} onPress={() => navigation.navigate('User', { user })}>
					<Avatar source={user.avatar} size={PxFit(24)} />
					<Text style={styles.userName}>{user.name}</Text>
				</TouchFeedback>
				{shieldingAd && (
					<TouchFeedback
						style={{ paddingBottom: PxFit(Theme.itemSpace), alignItems: 'center' }}
						onPress={() => {
							this.showRewordRule(shieldingAd, category);
							// Toast.show({ content: `${category.name}免广告服务到期时间：${shieldingAd}` });
						}}
					>
						<Image source={require('../../../assets/images/ad.png')} style={{ width: 24, height: 24 }} />
					</TouchFeedback>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	userItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: PxFit(Theme.itemSpace)
	},
	userName: { fontSize: PxFit(13), color: Theme.defaultTextColor, paddingLeft: PxFit(6) },
	overlayInner: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		height: PxFit(38),
		borderRadius: PxFit(19),
		marginTop: PxFit(10),
		backgroundColor: Theme.primaryColor
	}
});

export default UserInfo;
