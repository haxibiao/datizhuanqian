/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:55:53
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { Player } from '../../../components';
import { SCREEN_WIDTH, Theme } from '../../../utils';

class Default extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { question } = this.props;
		return (
			<View>
				<Text style={styles.title}>{question.description}</Text>
				<View style={{ marginTop: 10 }}>
					{question.image && (
						<Image
							source={{
								uri: question.image.path
							}}
							style={{
								width: SCREEN_WIDTH - 60,
								height: (question.image.height / question.image.width) * (SCREEN_WIDTH - 60),
								borderRadius: 5
							}}
						/>
					)}
					{question.video && <Player width={SCREEN_WIDTH - 60} source={question.video.path} />}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		color: Theme.primaryFont,
		fontSize: 16,
		fontWeight: '400',
		fontFamily: 'Courier',
		letterSpacing: 0.5,
		lineHeight: 22
	}
});

export default Default;
