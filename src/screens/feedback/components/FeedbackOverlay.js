/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 16:11:05
 */

'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, NAVBAR_HEIGHT } from '../../../utils';
import { Overlay } from 'teaset';
import { Iconfont, TouchFeedback } from '../../../components';

class FeedbackOverlay {
	static show(switchKeybord, replyComment, comment, user, feedback_id) {
		let overlayView = (
			<Overlay.View animated>
				<TouchFeedback
					style={styles.container}
					onPress={() => {
						FeedbackOverlay.hide();
					}}
				>
					<View style={styles.content}>
						<TouchFeedback
							style={{ paddingVertical: PxFit(15) }}
							onPress={() => {
								FeedbackOverlay.hide();
								Toast.show({ content: '举报成功' });
							}}
						>
							<Text style={styles.text}>举报</Text>
						</TouchFeedback>
						{comment && (
							<TouchFeedback
								style={styles.comment}
								onPress={() => {
									FeedbackOverlay.hide();
									switchKeybord();
									replyComment(comment);
								}}
							>
								<Text style={styles.text}>引用</Text>
							</TouchFeedback>
						)}
						{/*	{!feedback
					? user.id == comment.user.id && (
							<TouchFeedback
								style={{ paddingVertical: PxFit(15), borderTopColor: Theme.lightBorder, borderTopWidth: PxFit(0.5) }}
								onPress={this.deleteComment}
							>
								<Text style={{ fontSize: PxFit(15), color: Theme.black, paddingLeft: PxFit(15) }}>删除</Text>
							</TouchFeedback>
					  )
					: null}*/}
					</View>
				</TouchFeedback>
			</Overlay.View>
		);
		this.OverlayKey = Overlay.show(overlayView);
	}

	static hide() {
		Overlay.hide(this.OverlayKey);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		backgroundColor: 'rgba(255,255,255,0)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	content: {
		width: SCREEN_WIDTH - PxFit(100),
		borderRadius: PxFit(10),
		padding: 0,
		backgroundColor: '#fff'
	},
	text: { fontSize: PxFit(15), color: Theme.black, paddingLeft: PxFit(15) },

	comment: {
		paddingVertical: PxFit(15),
		borderTopColor: Theme.lightBorder,
		borderTopWidth: PxFit(0.5)
	}
});

export default FeedbackOverlay;
