/*
 * @flow
 * created by wyk made in 2019-04-20 11:54:52
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Row, Iconfont } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH, WPercent } from '../../../utils';
import { Overlay } from 'teaset';

class AnswerOverlay {
	static Expression(type, bool) {
		let expression = {
			answer: {
				image: bool
					? require('../../../assets/images/correct.png')
					: require('../../../assets/images/error.png')
			},
			audit: {
				image: bool
					? require('../../../assets/images/audit_approve.png')
					: require('../../../assets/images/audit_refused.png')
			}
		};
		return expression[type] && expression[type].image;
	}

	static Title(type, bool) {
		let title = {
			answer: {
				text: bool ? '回答正确' : '回答错误'
			},
			audit: {
				text: bool ? '已同意' : '已拒绝'
			}
		};
		return title[type] && title[type].text;
	}

	static countdownColose() {
		this.timer && clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.overlayKey && Overlay.hide(this.overlayKey);
		}, 1000);
	}

	static show(props) {
		const { gold, ticket, result, type } = props;
		let overlayView = (
			<Overlay.View modal animated onAppearCompleted={() => AnswerOverlay.countdownColose()}>
				<View style={styles.overlay}>
					<View style={styles.main}>
						<View style={styles.title}>
							<Text
								style={[
									styles.titleText,
									type == 'answer' && { color: result ? Theme.primaryColor : Theme.errorColor }
								]}
							>
								{AnswerOverlay.Title(type, result)}
							</Text>
							{type == 'audit' && <Text style={styles.resultText}>{`经验值+1   贡献+1`}</Text>}
							{type == 'answer' && result && (
								<Text style={styles.resultText}>
									{`经验值+1`}
									{ticket > 0 && `   智慧点+${gold}`}
								</Text>
							)}
						</View>
						<Image source={AnswerOverlay.Expression(type, result)} style={styles.image} />
					</View>
				</View>
			</Overlay.View>
		);
		this.overlayKey = Overlay.show(overlayView);
	}
}

const styles = StyleSheet.create({
	overlay: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1
	},
	main: {
		width: WPercent(60),
		height: WPercent(60),
		borderRadius: PxFit(5),
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: PxFit(Theme.itemSpace)
	},
	title: { alignItems: 'center' },
	titleText: {
		fontSize: PxFit(17),
		fontWeight: '500',
		color: Theme.defaultTextColor,
		marginBottom: PxFit(10)
	},
	resultText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		marginBottom: PxFit(15)
	},
	image: {
		width: WPercent(32),
		height: WPercent(32)
	}
});

export default AnswerOverlay;
