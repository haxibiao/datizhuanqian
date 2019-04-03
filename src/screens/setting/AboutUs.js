/*
 * @flow
 * created by wyk made in 2019-03-21 14:13:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';

class AboutUs extends Component {
	render() {
		return (
			<PageContainer title="关于答题赚钱" white>
				<ScrollView contentContainerStyle={{ flex: 1 }}>
					<View style={styles.container}>
						<View style={{ alignItems: 'center', marginTop: PxFit(15) }}>
							<Image
								source={require('../../assets/images/logo.png')}
								style={{
									width: SCREEN_WIDTH / 4,
									height: SCREEN_WIDTH / 4,
									borderRadius: SCREEN_WIDTH / 8
								}}
							/>
							<Text style={styles.AppVersion}>答题赚钱 {Config.AppVersion}</Text>
						</View>
						<View style={{ marginTop: PxFit(30) }}>
							<View style={{ paddingHorizontal: PxFit(20) }}>
								<Text style={styles.sectionTitle}>关于答题</Text>
								<Text style={styles.appIntro}>
									答题赚钱是一款手机休闲益智答题软件,有地理，英文，历史，科学，世界趣闻等知识分类。
									答题题目将不断更新，让您随时学到新的知识。成功答题的您还能获得收益哦！在等朋友,等公交,等吃饭或其他碎片时间。
									玩答题赚钱学知识拿金钱，是您killtime的最佳搭档。如果你觉得你掌握的知识够全面就快来答题赚钱吧，各国趣味知识，涵盖天文、地理、历史科学应有尽有。
									只要你能答对就能赚取相应报酬，快来答题赚钱试试身手吧。
								</Text>
							</View>
						</View>
						<View style={{ marginTop: PxFit(30) }}>
							<View style={{ paddingHorizontal: PxFit(20) }}>
								<Text style={styles.sectionTitle}>联系我们</Text>
								{/*<Text style={{ fontSize: 13, color: Theme.subTextColor, marginTop: 15 }}>QQ交流群: 4337413</Text>*/}
								<Text style={styles.officialText}>官网地址： datizhuanqian.com datizhuanqian.cn</Text>
								<Text style={styles.officialText}>商务合作： db@datizhuanqian.com</Text>
								<Text style={styles.officialText}>官方邮箱： dtzq@haxibiao.com</Text>
								<Text style={styles.officialText}>官方QQ群： 735220029</Text>
							</View>
						</View>
					</View>
					<View style={styles.copyright}>
						<Text>哈希表网络科技(深圳)有限公司</Text>
						<Text>www.datizhuanqian.com</Text>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	AppVersion: { color: Theme.defaultTextColor, fontSize: PxFit(15), margin: PxFit(20) },
	sectionTitle: { fontSize: 15, color: Theme.defaultTextColor },
	appIntro: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		marginTop: PxFit(15),
		lineHeight: PxFit(18),
		fontWeight: '300'
	},
	officialText: { fontSize: PxFit(13), color: Theme.subTextColor, marginTop: PxFit(10) },
	copyright: {
		backgroundColor: Theme.groundColour,
		marginTop: PxFit(30),
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		paddingVertical: PxFit(15),
		alignItems: 'center'
	}
});

export default AboutUs;
