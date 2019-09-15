/*
 * @flow
 * created by wyk made in 2019-09-12 10:44:16
 */
'use strict';

import React, { useMemo, useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Row } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Tools } from 'utils';
import { GQL, useMutation, useQuery } from 'apollo';
import { BoxShadow } from 'react-native-shadow';
import { Overlay } from 'teaset';
import SignedOverlay from './SignedOverlay';

type signIn = {
	id: any,
	created_at: string,
	day: string | number,
	month: string | number,
	year: string | number,
	gold_reward: number,
	withdraw_lines: number,
	signed: boolean,
};

const signInItem = {
	id: null,
	created_at: 111,
	day: 12,
	month: 9,
	year: 2019,
	gold_reward: 30,
	withdraw_lines: 0,
	signed: false, //布尔值
};

const signIns = (function() {
	return Array(7)
		.fill(0)
		.map(function(elem, index) {
			return Object.assign({}, signInItem, {
				id: index,
				signed: false,
				withdraw_lines: index === 4 ? 1 : 0,
				gold_reward: index * 10,
			});
		});
})();

const data = {
	data: { signInQuery: { keep_signin_days: 7, today_signed: false, signIns } },
};

const AttendanceBook = props => {
	const [boxShadowHeight, setBoxShadowHeight] = useState(150);

	const onLayoutEffect = useCallback(event => {
		setBoxShadowHeight(event.nativeEvent.layout.height);
	}, []);

	// const { data } = useQuery(GQL.signInQuery);
	const [todaySignIn] = useMutation(GQL.CreateSignInMutation);
	// {
	// 	refetchQueries: () => [
	// 		{
	// 			query: GQL.signInQuery,
	// 		},
	// 	],
	// }
	const signInData = useMemo(() => {
		return Tools.syncGetter('data.signInQuery', data) || {};
	}, [data]);
	const keep_signin_days = Tools.syncGetter('keep_signin_days', signInData);
	const today_signed = Tools.syncGetter('today_signed', signInData);
	const signIns = Tools.syncGetter('signIns', signInData);

	const toDaySignIn = useCallback(
		Tools.throttle(async () => {
			if (!today_signed) {
				console.log('todaySignIn', todaySignIn);
				try {
					const result = await todaySignIn();
					console.log('test result', result, signIns);
					const todayReturns = signIns[Tools.syncGetter('createSignIn.id', result)];
					onSignInSuccess(todayReturns);
				} catch (e) {
					Toast.show({ content: '签到失败' });
				}
				onSignInSuccess({ gold: 10, withdraw_lines: 0 });
			}
		}),
		[signIns, today_signed],
	);

	const onSignInSuccess = useCallback((returns: signIn) => {
		Overlay.show(<SignedOverlay gold={returns.gold} withdraw={returns.withdraw_lines} />);
	}, []);

	return (
		<BoxShadow
			setting={Object.assign({}, shadowOpt, {
				height: boxShadowHeight,
			})}>
			<View style={styles.attendanceBook} onLayout={onLayoutEffect}>
				<View style={styles.header}>
					<Row>
						<Image style={styles.coinImage} source={require('../../../assets/images/coin.png')} />
						<Text style={styles.titleText}>签到任务</Text>
					</Row>
					<Row>
						<Text style={styles.recordTextGrey}>已签</Text>
						<Text style={styles.recordTextYellow}>{`${1}/${signIns.length}`}</Text>
						<Text style={styles.recordTextGrey}>天</Text>
					</Row>
				</View>
				<TouchableWithoutFeedback onPress={toDaySignIn}>
					<View style={styles.attendance}>
						{signIns.map((elem, index) => {
							return (
								<View style={styles.recordDate} key={index}>
									{elem.withdraw_lines > 0 && (
										<ImageBackground
											style={styles.extraRewardImage}
											source={require('../../../assets/images/attendance_reward.png')}>
											<Text style={styles.extraRewardText}>+{elem.withdraw_lines}</Text>
										</ImageBackground>
									)}
									<ImageBackground
										style={styles.recordBg}
										source={
											elem.signed
												? require('../../../assets/images/attendance_coin.png')
												: require('../../../assets/images/attendance_coin_grey.png')
										}>
										<Text style={styles.rewardGoldText}>{elem.index}</Text>
									</ImageBackground>
									<Text style={styles.recordDayText}>{elem.signed ? '已签' : `${index + 1}天`}</Text>
								</View>
							);
						})}
					</View>
				</TouchableWithoutFeedback>
				{
					<View style={styles.footer}>
						<Text style={styles.footerText}>{`连续签到${signIns.length}天，增加一元临时提现额度`}</Text>
					</View>
				}
			</View>
		</BoxShadow>
	);
};

const rewardGoldWidth = (SCREEN_WIDTH - PxFit(Theme.itemSpace * 2)) / 7;
const rewardGoldImageWidth = rewardGoldWidth * 0.7;

const shadowOpt = {
	width: SCREEN_WIDTH - PxFit(Theme.itemSpace * 2),
	height: PxFit(150),
	color: '#E8E8E8',
	border: PxFit(10),
	radius: PxFit(10),
	opacity: 0.5,
	x: 0,
	y: 0,
	style: {
		margin: PxFit(Theme.itemSpace),
	},
};

const styles = StyleSheet.create({
	attendanceBook: {
		paddingVertical: PxFit(10),
		backgroundColor: '#fff',
		borderRadius: PxFit(10),
		shadowOffset: { width: PxFit(5), height: PxFit(5) },
		shadowColor: '#E8E8E8',
		shadowOpacity: 0.8,
		shadowRadius: PxFit(10),
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: PxFit(10),
	},
	coinImage: {
		width: PxFit(20),
		height: PxFit(20),
		marginRight: PxFit(4),
	},
	titleText: {
		fontSize: PxFit(16),
		color: Theme.defaultTextColor,
		fontWeight: 'bold',
	},
	recordTextGrey: {
		fontSize: PxFit(14),
		color: Theme.subTextColor,
	},
	recordTextYellow: {
		fontSize: PxFit(14),
		color: Theme.secondaryColor,
	},
	attendance: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		paddingVertical: PxFit(15),
	},
	recordDate: {
		paddingHorizontal: rewardGoldWidth * 0.15,
		justifyContent: 'center',
		alignItems: 'center',
	},
	extraRewardImage: {
		width: rewardGoldImageWidth,
		height: (rewardGoldImageWidth * 108) / 168,
		paddingBottom: ((rewardGoldImageWidth * 108) / 168) * 0.31,
		justifyContent: 'center',
		alignItems: 'center',
	},
	extraRewardText: {
		fontSize: PxFit(12),
		color: '#fff',
	},
	recordBg: {
		width: rewardGoldImageWidth,
		height: rewardGoldImageWidth,
		justifyContent: 'center',
		alignItems: 'center',
	},
	rewardGoldText: {
		fontSize: PxFit(16),
		color: '#9E6124', // #ADADAD
		fontWeight: 'bold',
	},
	recordDayText: {
		marginTop: PxFit(10),
		fontSize: PxFit(14),
		color: Theme.defaultTextColor,
	},
	footer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerText: {
		fontSize: PxFit(15),
		color: '#9E6124',
	},
});

export default AttendanceBook;
