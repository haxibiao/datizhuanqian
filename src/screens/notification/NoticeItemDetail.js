/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:55:51
 */

//TODO:通知待完善

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Iconfont, TouchFeedback, PageContainer } from 'components';
import { Theme, PxFit, Tools, SCREEN_WIDTH } from 'utils';

class NoticeItemDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, user, notification } = this.props;

		let { notice } = navigation.state.params;

		return (
			<PageContainer title={notice.title} white>
				<View
					style={{
						alignItems: 'center',
						paddingHorizontal: 15
						// marginTop: 15
					}}
				>
					<View style={{ marginTop: 20 }}>
						<Text style={{ fontSize: 13, lineHeight: 18 }}>{notice.content}</Text>
					</View>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default NoticeItemDetail;
