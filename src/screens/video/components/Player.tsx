import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import Video from 'react-native-video';
import { Iconfont } from 'components';
import { useDoubleAction, syncGetter } from 'common';
import { observer } from 'store';
import { PxFit, Theme, Tools } from 'utils';
import { useApolloClient } from '@src/apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import VideoStore from '../VideoStore';
import VideoLoading from './VideoLoading';
import Operation from './Operation';
import { useNavigation } from 'react-navigation-hooks';
import { Overlay } from 'teaset';

export default observer(props => {
	const { media, index } = props;
	const navigation = useNavigation();
	const client = useApolloClient();
	const [progress, setProgress] = useState(0);
	const currentTime = useRef(0);
	const duration = useRef(100);
	const videoRef = useRef();
	const isIntoView = index === VideoStore.viewableItemIndex;
	const [paused, setPause] = useState(true);
	const [loading, setLoaded] = useState(true);
	const resizeMode = useMemo(() => {
		const videoHeight = media.video.height;
		const videoWidth = media.video.width;
		return videoHeight > videoWidth * 1.3 ? 'cover' : 'contain';
	}, [media]);

	const onLongPress = useCallback(() => {
		let overlayRef;
		const MoreOperationOverlay = (
			<Overlay.PopView
				style={styles.overlay}
				ref={ref => (overlayRef = ref)}
				containerStyle={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
				<ApolloProvider client={client}>
					<Operation
						onPressIn={() => overlayRef.close()}
						target={media}
						downloadUrl={Tools.syncGetter('video.url', media)}
						downloadUrlTitle={Tools.syncGetter('body', media)}
						options={['不感兴趣', '举报']}
					/>
				</ApolloProvider>
			</Overlay.PopView>
		);
		Overlay.show(MoreOperationOverlay);
	}, [client, media]);

	const togglePause = useCallback(() => {
		setPause(v => !v);
	}, []);

	const giveALike = useCallback(() => {
		if (TOKEN && !media.liked) {
			media.liked ? media.count_likes-- : media.count_likes++;
			media.liked = !media.liked;
		}
	}, [TOKEN, media]);
	// 双击点赞、单击暂停视频
	const onPress = useDoubleAction(giveALike, 200, togglePause);

	const videoEvents = useMemo((): object => {
		return {
			onLoadStart() {
				setProgress(0);
				currentTime.current = 0;
			},

			onLoad(data) {
				duration.current = data.duration;
				setLoaded(false);
			},

			onProgress(data) {
				if (!media.watched) {
					VideoStore.rewardProgress += data.currentTime - currentTime.current;
					if (Math.abs(currentTime.current - duration.current) <= 1) {
						media.watched = true;
					}
				}
				setProgress(data.currentTime);
				currentTime.current = data.currentTime;
			},

			onEnd() {},

			onError() {},

			onAudioBecomingNoisy() {
				setPause(true);
			},

			onAudioFocusChanged(event: { hasAudioFocus: boolean }) {
				videoRef.current.seek(0);
			},
		};
	}, []);

	useEffect(() => {
		setPause(!isIntoView);
		const navWillFocusListener = navigation.addListener('willFocus', () => {
			setPause(!isIntoView);
		});
		const navWillBlurListener = navigation.addListener('willBlur', () => {
			setPause(true);
		});
		return () => {
			navWillFocusListener.remove();
			navWillBlurListener.remove();
		};
	}, [isIntoView]);

	return (
		<TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
			<View style={styles.playContainer}>
				<Video
					ref={videoRef}
					resizeMode={resizeMode}
					paused={paused}
					source={{
						uri: syncGetter('video.url', media),
					}}
					style={styles.fullScreen}
					rate={1} // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
					volume={1} // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
					muted={false} // true代表静音，默认为false.
					progressUpdateInterval={150}
					disableFocus={true}
					useTextureView={false}
					repeat={true} // 是否重复播放
					ignoreSilentSwitch='obey'
					playWhenInactive={false}
					playInBackground={false}
					{...videoEvents}
				/>

				{paused && <Iconfont name='paused' size={PxFit(70)} color='rgba(255,255,255,0.8)' />}
				<View style={styles.bottom}>
					<VideoLoading loading={loading} />
					<View style={[styles.progress, { width: (progress / duration.current) * 100 + '%' }]} />
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
});

const styles = StyleSheet.create({
	bottom: {
		backgroundColor: 'rgba(255,255,255,0.5)',
		bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(56),
		height: PxFit(1),
		left: 0,
		position: 'absolute',
		right: 0,
	},
	fullScreen: {
		bottom: 0,
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
	},
	playContainer: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		left: 0,
		position: 'absolute',
		right: 0,
		top: 0,
	},
	progress: {
		backgroundColor: '#fff',
		bottom: 0,
		height: PxFit(1),
		left: 0,
		position: 'absolute',
		width: 0,
	},
});
