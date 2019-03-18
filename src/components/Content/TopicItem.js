/*
* @flow
* created by wyk made in 2019-01-09 12:00:35
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Theme, PxFit } from '../../utils';

import Iconfont from '../Iconfont';
import Avatar from '../Basics/Avatar';
import SafeText from '../Basics/SafeText';
import Row from '../Container/Row';
import TouchFeedback from '../TouchableView/TouchFeedback';
import FollowButton from '../TouchableView/FollowButton';

type Topic = {
	id: number,
	logo: any,
	name: string,
	count_articles: number,
	description?: string,
	followed: boolean
};

type Props = {
	topic: Topic
};

class TopicItem extends Component<Props> {
	render() {
		let { topic, style, navigation } = this.props;
		let { id, logo, name, gender, count_articles, description, followed } = topic;
		return (
			<TouchFeedback style={[styles.item, style]} onPress={() => navigation.navigate('Topic')}>
				<Avatar source={{ uri: logo }} size={PxFit(48)} style={{ borderRadius: PxFit(6) }} />
				<View style={styles.middle}>
					<Row>
						<SafeText style={styles.nameText}>{name}</SafeText>
					</Row>
					<SafeText style={styles.description} numberOfLines={1}>
						{description ? description : count_articles + '条动态'}
					</SafeText>
				</View>
				<FollowButton
					id={id}
					followedStatus={followed}
					followedTarget={'topic'}
					style={{
						width: PxFit(70),
						height: PxFit(30),
						borderRadius: PxFit(15)
					}}
				/>
			</TouchFeedback>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: PxFit(Theme.itemSpace),
		paddingVertical: PxFit(16)
	},
	middle: {
		flex: 1,
		marginHorizontal: PxFit(Theme.itemSpace)
	},
	nameText: {
		fontSize: PxFit(16),
		color: Theme.defaultTextColor,
		marginRight: PxFit(6)
	},
	description: {
		marginTop: PxFit(8),
		fontSize: PxFit(12),
		color: '#696482'
	}
});

export default withNavigation(TopicItem);
