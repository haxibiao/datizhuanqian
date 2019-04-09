/*
 * @flow
 * created by wyk made in 2019-02-25 17:34:23
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { withNavigation } from 'react-navigation';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';
import Iconfont from '../Iconfont';

class Player extends React.PureComponent {
	constructor(props) {
		super(props);
		this.waveValue = new Animated.Value(0);
		this.state = {
			// 初始化播放状态
			paused: this.props.paused,
			loaded: false
		};
	}

	componentDidMount() {
		console.log('componentDidMount');
		let { navigation } = this.props;
		this.didFocusSubscription = navigation.addListener('willFocus', payload => {
			this.setState({ paused: false });
		});
		this.willBlurSubscription = navigation.addListener('willBlur', payload => {
			this.setState({ paused: true });
		});
	}

	componentWillUnmount() {
		this.didFocusSubscription.remove();
		this.willBlurSubscription.remove();
	}

	//有异常，应该暂停播放
	onAudioBecomingNoisy = () => {
		console.log('onAudioBecomingNoisy...');
		console.log('video url:', this.props.source);
		this.setState({ paused: true });
	};

	//失去声音聚焦，也暂停
	onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
		console.log('onAudioFocusChanged ...', event);
		console.log('video url:', this.props.source);
		// this.video.reset();
		this.video.seek(0);
		// if (!this.state.paused && !event.hasAudioFocus) {
		// 	this.setState({ paused: true });
		// }
	};

	_loadStart = () => {};

	_onLoaded = data => {
		this.setState({
			loaded: true
			// duration: data.duration
		});
	};

	// _onProgressChanged = data => {
	// 	if (!this.state.paused) {
	// 		this.setState({
	// 			currentTime: data.currentTime
	// 		});
	// 	}
	// };

	_onPlayEnd = () => {
		this.setState({
			paused: true
		});
	};

	_onPlayError = () => {
		Toast.show('播放失败，请重新尝试');
	};

	control = () => {
		this.setState(prevState => ({ paused: !this.state.paused }));
	};

	render() {
		let { paused, loaded } = this.state;
		let { source, muted, width = SCREEN_WIDTH - PxFit(40) } = this.props;
		return (
			<TouchableOpacity
				style={[styles.playContainer, { width, height: width * 0.65 }]}
				activeOpacity={1}
				onPress={this.control}
			>
				<Video
					ref={ref => {
						this.video = ref;
					}}
					source={{ uri: source }}
					style={styles.fullScreen}
					rate={1} // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
					paused={paused}
					volume={1} // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
					muted={muted} // true代表静音，默认为false.
					resizeMode={'contain'} // 视频的自适应伸缩铺放行为，
					onLoad={this._onLoaded} // 当视频加载完毕时的回调函数
					onLoadStart={this._loadStart} // 当视频开始加载时的回调函数
					// onProgress={this._onProgressChanged} //  进度控制，每250ms调用一次，以获取视频播放的进度
					// onEnd={this._onPlayEnd} // 当视频播放完毕后的回调函数
					onError={this.videoError} // 当视频不能加载，或出错后的回调函数
					onAudioBecomingNoisy={this.onAudioBecomingNoisy}
					onAudioFocusChanged={this.onAudioFocusChanged}
					disableFocus={true}
					useTextureView={false}
					playWhenInactive={false}
					repeat={true} // 是否重复播放
					ignoreSilentSwitch="obey"
				/>
				{!loaded && <ActivityIndicator color={'#fff'} size={'large'} />}
				{loaded && paused && <Iconfont name="paused" size={PxFit(60)} color="#fff" style={{ opacity: 0.8 }} />}
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	playContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000'
	},
	fullScreen: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	}
});

export default withNavigation(Player);
