/*
 * @flow
 * created by wyk made in 2019-06-28 09:35:27
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import { PageContainer, TouchFeedback, PopOverlay, Iconfont, PullChooser, Player } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';

class VideoExplanation extends Component {
	render() {
		let video = this.props.navigation.getParam('video', {});
		return (
			<PageContainer hiddenNavBar>
				<StatusBar translucent={true} hidden />
				<View style={styles.container}>
					{video && video.url && <Player style={{ flex: 1 }} video={video} inScreen />}
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000'
	}
});

export default VideoExplanation;
