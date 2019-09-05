/*
 * @flow
 * created by wyk made in 2019-07-01 11:22:45
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from '../../utils';
import Iconfont from '../Iconfont';
import { observer, Provider, inject } from 'mobx-react';
import { app, config } from 'store';

import Slider from '@react-native-community/slider';

@observer
class VideoControl extends Component {
	render() {
		let {
			sliderMoveing,
			sliderValue,
			showControl,
			currentTime,
			duration,
			paused,
			onSliderValueChanged,
			onSlidingComplete,
			playButtonHandler,
			onFullScreen
		} = this.props.videoStore;
		let { isFullScreen } = config;

		if (!showControl) {
			return null;
		}
		return (
			<View style={styles.videoControl}>
				{config.isFullScreen && (
					<TouchableOpacity activeOpacity={1} onPress={onFullScreen} style={styles.headerControl}>
						<Iconfont name="left" size={PxFit(22)} color="#fff" />
					</TouchableOpacity>
				)}
				<TouchableWithoutFeedback style={styles.pauseMark} onPress={playButtonHandler}>
					<View style={{ padding: PxFit(20) }}>
						<Iconfont name={paused ? 'paused' : 'play'} size={PxFit(40)} color="#fff" />
					</View>
				</TouchableWithoutFeedback>
				<View style={styles.bottomControl}>
					<Text style={styles.timeText}>{Tools.TimeFormat(sliderMoveing ? sliderValue : currentTime)}</Text>
					<Slider
						style={{ flex: 1, marginHorizontal: PxFit(10) }}
						maximumTrackTintColor="rgba(225,225,225,0.5)" //滑块右侧轨道的颜色
						minimumTrackTintColor={'#fff'} //滑块左侧轨道的颜色
						thumbTintColor="#fff"
						value={sliderMoveing ? sliderValue : currentTime}
						minimumValue={0}
						maximumValue={Number(duration)}
						onValueChange={onSliderValueChanged}
						onSlidingComplete={onSlidingComplete}
					/>
					<Text style={styles.timeText}>{Tools.TimeFormat(duration)}</Text>
					<TouchableOpacity activeOpacity={1} onPress={onFullScreen} style={styles.layoutButton}>
						<Iconfont
							name={config.isFullScreen ? 'defullScreen' : 'fullScreen'}
							size={PxFit(20)}
							color="#fff"
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	videoControl: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerControl: {
		position: 'absolute',
		top: PxFit(15),
		left: PxFit(15),
		width: PxFit(40),
		height: PxFit(40),
		justifyContent: 'center'
	},
	pauseMark: {
		width: PxFit(60),
		height: PxFit(60),
		alignItems: 'center',
		justifyContent: 'center'
	},
	bottomControl: {
		position: 'absolute',
		left: PxFit(20),
		right: PxFit(20),
		bottom: PxFit(10),
		flexDirection: 'row',
		alignItems: 'center'
	},
	layoutButton: {
		marginLeft: PxFit(10),
		width: PxFit(40),
		height: PxFit(40),
		alignItems: 'center',
		justifyContent: 'center'
	},
	timeText: {
		fontSize: PxFit(12),
		color: '#fff'
	}
});

export default VideoControl;
