/*
 * @Author: Gaoxuan
 * @Date:   2019-05-28 16:30:05
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { Overlay } from 'teaset';
import { SafeText, TouchFeedback, ItemSeparator, Iconfont } from '../../../components';

import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Api } from '../../../utils';
import { Share } from 'native';
import QuestionShareCard from '../../share/components/QuestionShareCard';
import QuestionShareCardOverlay from '../../share/components/QuestionShareCardOverlay';

type ChooserItem = {
	title: string,
	onPress: Function
};

class ChooseOverly {
	static show(question, navigation, category, min_level, user) {
		let overlayView = (
			<Overlay.PullView
				containerStyle={{ backgroundColor: Theme.white }}
				style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
				animated
				ref={ref => (this.popViewRef = ref)}
			>
				<View style={styles.actionSheetView}>
					<TouchFeedback
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							paddingVertical: 15
						}}
						onPress={() => {
							this.popViewRef.close();
							navigation.navigate('Share');
						}}
					>
						<Text style={{ fontSize: 16, color: Theme.grey }}>去分享</Text>
			
					</TouchFeedback>
					<View style={styles.top}>
						<TouchFeedback
							onPress={async () => {
								this.popViewRef.close();
								let result = await this._shareCard.onCapture();
								let callback = await Share.shareWechat(result);
								if (callback == false) {
									Toast.show({
										content: '请先安装微信客户端'
									});
								}
							}}
							style={{ alignItems: 'center' }}
						>
							<Image source={require('../../../assets/images/wechat.png')} style={styles.imageStyle} />

							<Text style={{ color: Theme.grey, fontSize: 12 }}>微信好友</Text>
						</TouchFeedback>
						<TouchFeedback
							onPress={async () => {
								this.popViewRef.close();
								let result = await this._shareCard.onCapture();
								let callback = await Share.shareWechatMoment(result);

								if (callback == false) {
									Toast.show({
										content: '请先安装微信客户端'
									});
								}
							}}
							style={{ alignItems: 'center' }}
						>
							<Image source={require('../../../assets/images/friends.png')} style={styles.imageStyle} />
							<Text style={{ color: Theme.grey, fontSize: 12 }}>朋友圈</Text>
						</TouchFeedback>
						<TouchFeedback
							onPress={async () => {
								this.popViewRef.close();
								let result = await this._shareCard.onCapture();
								let callback = await Share.shareImageToQQ(result);
								if (callback == false) {
									Toast.show({
										content: '请先安装QQ客户端'
									});
								}
							}}
							style={{ alignItems: 'center' }}
						>
							<Image source={require('../../../assets/images/qq.png')} style={styles.imageStyle} />
							<Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
						</TouchFeedback>
						<TouchFeedback
							onPress={async () => {
								this.popViewRef.close();
								let result = await this._shareCard.onCapture();
								let callback = await Share.shareToSinaFriends(result);
								if (callback == false) {
									Toast.show({
										content: '请先安装微博客户端'
									});
								}
							}}
							style={{ alignItems: 'center' }}
						>
							<Image source={require('../../../assets/images/weibo.png')} style={styles.imageStyle} />
							<Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
						</TouchFeedback>
						<TouchFeedback
							onPress={async () => {
								this.popViewRef.close();
								let result = await this._shareCard.onCapture();
								let callback = await Share.shareImageToQQZone(result);
								if (callback == false) {
									Toast.show({
										content: '请先安装QQ空间客户端'
									});
								}
							}}
							style={{ alignItems: 'center' }}
						>
							<Image source={require('../../../assets/images/qzone.png')} style={styles.imageStyle} />
							<Text style={{ color: Theme.grey, fontSize: 12 }}>QQ空间</Text>
						</TouchFeedback>
					</View>
					<View style={styles.bottom}>
						<TouchFeedback
							onPress={async () => {
								this.popViewRef.close();
								let result = await this._shareCard.onCapture(true);
								QuestionShareCardOverlay.show(result, question, user);
							}}
							style={{ alignItems: 'center' }}
						>
							<View style={styles.iconStyle}>
								<Iconfont name={'photo'} size={24} color={Theme.grey} />
							</View>
							<Text style={{ color: Theme.grey, fontSize: 12 }}>长图分享</Text>
						</TouchFeedback>
						{/*	<TouchFeedback
							onPress={() => {
								this.popViewRef.close();
								navigation.navigate('Share');
							}}
							style={{ alignItems: 'center', marginLeft: (SCREEN_WIDTH - 230) / 5 }}
						>
							<View style={styles.iconStyle}>
								<Iconfont name={'question'} size={24} color={Theme.grey} />
							</View>
							<Text style={{ color: Theme.grey, fontSize: 12 }}>分享活动</Text>
						</TouchFeedback>*/}
						<TouchFeedback
							onPress={() => {
								this.popViewRef.close();
								navigation.navigate('ReportQuestion', { question });
							}}
							style={{ alignItems: 'center', marginLeft: (SCREEN_WIDTH - 230) / 5 }}
						>
							<View style={styles.iconStyle}>
								<Image
									source={require('../../../assets/images/report.png')}
									style={{ width: 24, height: 24 }}
								/>
							</View>
							<Text style={{ color: Theme.grey, fontSize: 12 }}>举报</Text>
						</TouchFeedback>
						<TouchFeedback
							onPress={() => {
								this.popViewRef.close();
								if (user.level.level < min_level) {
									Toast.show({
										content: `${min_level}级后才可以出题哦`
									});
								} else {
									navigation.navigate('Contribute', { category });
								}
							}}
							style={{ alignItems: 'center', marginLeft: (SCREEN_WIDTH - 230) / 5 }}
						>
							<View style={styles.iconStyle}>
								<Iconfont name={'brush'} size={24} color={Theme.grey} />
							</View>
							<Text style={{ color: Theme.grey, fontSize: 12 }}>出题</Text>
						</TouchFeedback>
					</View>
					<TouchFeedback
						style={styles.closeItem}
						onPress={() => {
							this.popViewRef.close();
						}}
					>
						<Text style={styles.headerText}>取消</Text>
					</TouchFeedback>
					<QuestionShareCard
						question={question}
						ref={ref => (this._shareCard = ref)}
						user={user}
						shareMiniProgram
					/>
				</View>
			</Overlay.PullView>
		);
		this.OverlayKey = Overlay.show(overlayView);
	}
}

const styles = StyleSheet.create({
	actionSheetView: {
		marginBottom: Theme.HOME_INDICATOR_HEIGHT,
		overflow: 'hidden'
	},
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 15,
		paddingHorizontal: PxFit(Theme.itemSpace)
	},
	imageStyle: {
		width: 44,
		height: 44,
		borderRadius: 22,
		marginBottom: 10
	},
	bottom: {
		borderTopWidth: 0.8,
		borderTopColor: Theme.lightGray,
		borderBottomWidth: 0.8,
		borderBottomColor: Theme.lightGray,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 15,
		paddingHorizontal: 15
	},
	iconStyle: {
		height: 44,
		width: 44,
		borderRadius: 22,
		backgroundColor: Theme.lightGray,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10
	},
	headerText: {
		fontSize: PxFit(15),
		color: Theme.confirmColor,
		textAlign: 'center'
	},
	closeItem: {
		height: PxFit(40),
		justifyContent: 'center',
		backgroundColor: '#fff',
		marginBottom: 5,
		borderRadius: PxFit(6)
	}
});

export default ChooseOverly;
