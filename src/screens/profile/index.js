/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:55
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	Avatar,
	ListItem,
	CustomSwitch,
	ItemSeparator,
	PopOverlay,
	CustomRefreshControl,
	ListFooter,
	Placeholder
} from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';
import { Query, withApollo, compose, graphql } from 'react-apollo';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { CategoriesQuery, QuestionQuery } from '../../assets/graphql/question.graphql';

import { BoxShadow } from 'react-native-shadow';

const shadowOpt = {
	width: SCREEN_WIDTH - Theme.itemSpace * 2,
	color: '#E8E8E8',
	border: PxFit(3),
	radius: PxFit(10),
	opacity: 0.5,
	x: 0,
	y: 1,
	style: {
		marginTop: 0
	}
};

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let { navigation, user, login = false } = this.props;
		return (
			<PageContainer hiddenNavBar>
				<ScrollView style={styles.container} bounces={false}>
					<View style={{ marginBottom: -Theme.itemSpace }}>
						<View style={styles.userInfoContainer}>
							<TouchFeedback
								navigation={navigation}
								authenticated
								activeOpacity={1}
								style={styles.userInfo}
							>
								<Avatar
									source={user.avatar || require('../../assets/images/default_avatar.png')}
									size={PxFit(60)}
									style={styles.userAvatar}
								/>
								<View style={styles.textInfo}>
									<Text style={styles.userName} numberOfLines={1}>
										{user.name || '登录/注册'}
									</Text>
									<Text style={styles.introduction} numberOfLines={1}>
										{user.introduction || '欢迎来到答题赚钱'}
									</Text>
								</View>
								<Iconfont name={'right'} size={PxFit(20)} color={'#fff'} />
							</TouchFeedback>
							<View style={styles.metaWrap}>
								<View style={styles.metaItem}>
									<Text style={styles.metaCount} numberOfLines={1}>
										{user.level ? user.level.level : 0}
									</Text>
									<Text style={styles.metaLabel} numberOfLines={1}>
										等级
									</Text>
								</View>
								<TouchFeedback
									navigation={navigation}
									authenticated
									activeOpacity={1}
									style={styles.metaItem}
								>
									<Text style={styles.metaCount} numberOfLines={1}>
										{user.followers_count || 0}
									</Text>
									<Text style={styles.metaLabel} numberOfLines={1}>
										粉丝
									</Text>
								</TouchFeedback>
								<TouchFeedback
									navigation={navigation}
									authenticated
									activeOpacity={1}
									style={styles.metaItem}
								>
									<Text style={styles.metaCount} numberOfLines={1}>
										{user.follow_users_count || 0}
									</Text>
									<Text style={styles.metaLabel} numberOfLines={1}>
										关注
									</Text>
								</TouchFeedback>
								<View style={styles.metaItem}>
									<Text style={styles.metaCount} numberOfLines={1}>
										{user.gold || 0}
									</Text>
									<Text style={styles.metaLabel} numberOfLines={1}>
										智慧点
									</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={{ paddingHorizontal: Theme.itemSpace, marginBottom: Theme.itemSpace }}>
						<BoxShadow
							setting={Object.assign({}, shadowOpt, {
								height: PxFit(80)
							})}
						>
							<View style={[styles.metaWrap, styles.metaWrapBottom]}>
								<TouchFeedback
									navigation={navigation}
									authenticated
									activeOpacity={1}
									style={styles.metaItem}
								>
									<Image
										style={styles.metaIcon}
										source={require('../../assets/images/profile_make_question.png')}
									/>
									<Text style={styles.metaIconLabel} numberOfLines={1}>
										我的出题
									</Text>
								</TouchFeedback>
								<TouchFeedback
									navigation={navigation}
									authenticated
									activeOpacity={1}
									style={styles.metaItem}
								>
									<Image
										style={styles.metaIcon}
										source={require('../../assets/images/profile_collection.png')}
									/>
									<Text style={styles.metaIconLabel} numberOfLines={1}>
										我的收藏
									</Text>
								</TouchFeedback>
								<TouchFeedback
									navigation={navigation}
									authenticated
									activeOpacity={1}
									style={styles.metaItem}
								>
									<Image
										style={styles.metaIcon}
										source={require('../../assets/images/profile_correct.png')}
									/>
									<Text style={styles.metaIconLabel} numberOfLines={1}>
										纠错记录
									</Text>
								</TouchFeedback>
								<TouchFeedback
									navigation={navigation}
									authenticated
									activeOpacity={1}
									style={styles.metaItem}
								>
									<Image
										style={styles.metaIcon}
										source={require('../../assets/images/profile_answer_history.png')}
									/>
									<Text style={styles.metaIconLabel} numberOfLines={1}>
										答题记录
									</Text>
								</TouchFeedback>
							</View>
						</BoxShadow>
					</View>
					<TouchFeedback
						style={styles.columnItem}
						authenticated
						navigation={navigation}
						onPress={() => navigation.navigate('Setting')}
					>
						<Row>
							<Iconfont name={'withdraw'} size={PxFit(20)} style={styles.itemType} color={'#FFBB04'} />
							<Text style={styles.itemTypeText}>我的钱包</Text>
						</Row>
						<Iconfont name="right" size={17} color={Theme.subTextColor} />
					</TouchFeedback>
					<TouchFeedback
						style={styles.columnItem}
						authenticated
						navigation={navigation}
						onPress={() => navigation.navigate('Setting')}
					>
						<Row>
							<Iconfont name={'feedback2'} size={PxFit(22)} style={styles.itemType} color={'#BB8DF3'} />
							<Text style={styles.itemTypeText}>意见反馈</Text>
						</Row>
						<Iconfont name="right" size={17} color={Theme.subTextColor} />
					</TouchFeedback>
					<View style={{ height: 10 }} />
					<TouchFeedback
						style={styles.columnItem}
						authenticated
						navigation={navigation}
						onPress={() => navigation.navigate('Setting')}
					>
						<Row>
							<Iconfont name={'question'} size={PxFit(24)} style={styles.itemType} color={'#FF5E7D'} />
							<Text style={styles.itemTypeText}>常见问题</Text>
						</Row>
						<Iconfont name="right" size={17} color={Theme.subTextColor} />
					</TouchFeedback>
					<TouchFeedback
						style={styles.columnItem}
						authenticated
						navigation={navigation}
						onPress={() => navigation.navigate('Setting')}
					>
						<Row>
							<Iconfont name={'setting1'} size={PxFit(24)} style={styles.itemType} color={'#7971F3'} />
							<Text style={styles.itemTypeText}>设置</Text>
						</Row>
						<Iconfont name="right" size={17} color={Theme.subTextColor} />
					</TouchFeedback>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.groundColour
	},
	userInfoContainer: {
		padding: Theme.itemSpace,
		paddingTop: PxFit(Theme.statusBarHeight + 20),
		backgroundColor: Theme.primaryColor
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	userAvatar: {
		borderWidth: PxFit(2),
		borderColor: '#fff'
	},
	textInfo: {
		flex: 1,
		paddingHorizontal: Theme.itemSpace
	},
	userName: {
		fontSize: PxFit(17),
		color: '#fff',
		fontWeight: '500'
	},
	introduction: {
		marginTop: PxFit(8),
		fontSize: PxFit(13),
		color: '#fff'
	},
	metaWrap: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingHorizontal: 10,
		height: PxFit(70)
	},
	metaWrapBottom: {
		backgroundColor: '#fff',
		borderRadius: PxFit(10),
		height: PxFit(80)
	},
	metaItem: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: Theme.itemSpace,
		paddingHorizontal: PxFit(5)
	},
	metaCount: {
		fontSize: PxFit(15),
		color: '#fff',
		fontWeight: '500'
	},
	metaLabel: {
		fontSize: PxFit(13),
		color: '#fff'
	},
	metaIcon: {
		width: PxFit(25),
		height: PxFit(25),
		resizeMode: 'cover'
	},
	metaIconLabel: {
		fontSize: PxFit(12),
		color: Theme.defaultTextColor
	},
	columnItem: {
		height: PxFit(52),
		paddingHorizontal: Theme.itemSpace,
		borderBottomWidth: PxFit(0.5),
		borderColor: Theme.borderColor,
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	itemTypeText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	itemType: {
		width: PxFit(25),
		textAlign: 'center',
		justifyContent: 'center',
		marginRight: PxFit(10)
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(index);
