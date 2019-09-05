/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Linking } from 'react-native';
import { PageContainer, Iconfont, TouchFeedback, Button, SubmitLoading, PopOverlay, Row } from 'components';

import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT } from 'utils';

import WithdrawBody from './components/WithdrawBody';
import NotLogin from './components/NotLogin';
import RuleDescription from './components/RuleDescription';

import { Overlay } from 'teaset';
import { app, observer } from 'store';

@observer
class index extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	showRule = () => {
		let overlayView = (
			<Overlay.View animated>
				<View style={styles.overlayInner}>
					<RuleDescription hide={() => Overlay.hide(this.OverlayKey)} />
				</View>
			</Overlay.View>
		);
		this.OverlayKey = Overlay.show(overlayView);
	};

	render() {
		const { navigation } = this.props;
		let { login } = app;
		return (
			<PageContainer
				title="提现"
				isTopNavigator
				rightView={
					<TouchFeedback onPress={this.showRule} style={styles.rule}>
						<Text>规则说明</Text>
					</TouchFeedback>
				}
			>
				{login ? <WithdrawBody navigation={navigation} /> : <NotLogin navigation={navigation} />}
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	rule: {
		flex: 1,
		justifyContent: 'center'
	},
	overlayInner: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default index;
