import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	FlatList,
	Image,
	Dimensions,
	Animated,
	StatusBar
} from 'react-native';
import Header from '../Header/Header';
import Button from '../Control/Button';
import { Colors, Config, Divice } from '../../constants';

import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

class AppIntro extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fadeAnim: new Animated.Value(1),
			bgc: '#FEFEFE'
		};
	}

	render() {
		let { fadeAnim, bgc } = this.state;
		let { navigation, showHome, introImages, actions, loading } = this.props;

		return (
			<View style={[styles.appLaunch, { backgroundColor: bgc }]}>
				{loading ? (
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							flex: 1
						}}
					>
						<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginBottom: 200 }}>
							<Image style={styles.loadingImage} source={require('../../../assets/images/logo.png')} />
							<Image
								style={{ width: width - 40, height: (width - 40) / 4, marginTop: 30 }}
								source={require('../../../assets/images/name.jpeg')}
							/>
						</View>

						<Text
							style={{
								color: Colors.tintFont,
								fontSize: 15,
								lineHeight: 20,
								marginBottom: 5,
								fontWeight: '300'
							}}
						>
							{Config.AppSlogan}
						</Text>
						<Text style={{ color: Colors.grey, fontSize: 12, paddingBottom: 30 }}>{Config.AppVersion}</Text>
					</View>
				) : (
					<Animated.View
						style={{
							flex: 1,
							position: 'absolute',
							height: StatusBar.currentHeight > 35 ? height + StatusBar.currentHeight : height,
							width,
							top: 0,
							left: 0,
							opacity: fadeAnim,
							backgroundColor: bgc
						}}
					>
						<Swiper autoplay={false} activeDotColor="#fff" showsPagination={true} loop={false}>
							{introImages.map((intro, index) => {
								return (
									<View key={index}>
										<Image
											source={{
												uri: intro.image_url
											}}
											style={styles.img}
											key={index}
										/>
										{index == introImages.length - 1 && (
											<TouchableOpacity
												style={styles.button}
												onPress={() => {
													this.setState({
														bgc: 'transparent'
													}); //渲染时白底,点击后透明底

													Animated.timing(this.state.fadeAnim, {
														toValue: 0,
														duration: 1200
													}).start();

													this.timer = setTimeout(() => {
														this.props.method();
													}, 1000);
													if (showHome) {
														this.timer && clearTimeout(this.timer);
													}
													actions();
													//传入版本号version
													//启动时先判断版本号   如果localstorge verison<local version 则展示
												}}
											>
												<Text style={{ color: Colors.white, fontSize: 16 }}>立即体验</Text>
											</TouchableOpacity>
										)}
									</View>
								);
							})}
						</Swiper>
					</Animated.View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	appLaunch: {
		flex: 1,
		width,
		height: StatusBar.currentHeight > 35 ? height + StatusBar.currentHeight : height,
		position: 'absolute',
		top: 0,
		left: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingImage: {
		width: (width * 3) / 8,
		height: (width * 3) / 8,
		borderRadius: (width * 3) / 16,
		borderWidth: 2,
		borderColor: Colors.tintGray
	},
	img: {
		width,
		height: StatusBar.currentHeight > 35 ? height + StatusBar.currentHeight : height,
		resizeMode: 'cover'
	},
	button: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: Colors.white,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 60,
		left: width / 2,
		marginLeft: -55,
		height: 35,
		width: 110,
		borderRadius: 5
	}
});

export default AppIntro;
