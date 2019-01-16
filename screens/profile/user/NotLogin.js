import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { Header } from '../../../components/Header';
import { DivisionLine, ErrorBoundary } from '../../../components/Universal';
import { Colors, Config, Divice } from '../../../constants';
import { Iconfont } from '../../../utils/Fonts';

class NotLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { navigation, login } = this.props;

		return (
			<TouchableOpacity
				style={styles.userInfoContainer}
				onPress={() => navigation.navigate('登录注册')}
				activeOpacity={1}
			>
				<View style={styles.userInfo}>
					<View style={{ flexDirection: 'row', marginLeft: 30 }}>
						<View style={styles.defaultAvatar}>
							<Iconfont name={'my'} size={44} color={Colors.lightFontColor} />
						</View>

						<View style={{ marginLeft: 20 }}>
							<View style={styles.headerInfo}>
								<Text style={styles.userName}>登录 / 注册</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center'
									}}
								>
									<Text style={styles.level}>LV.0</Text>
									<View style={styles.progress} />
									<View
										style={{
											height: 10,
											width: 0,
											backgroundColor: Colors.orange,
											borderRadius: 5,
											marginLeft: 10,
											marginLeft: -150
										}}
									/>
								</View>
							</View>
						</View>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							paddingVertical: 20
						}}
					>
						<View
							style={{
								paddingRight: 20,
								borderRightWidth: 1,
								borderRightColor: '#CD6839'
							}}
						>
							<Text style={{ color: Colors.orange }}>精力点: 0</Text>
						</View>
						<Text style={{ paddingLeft: 20, color: Colors.orange }}>智慧点: 0</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	userInfoContainer: {
		backgroundColor: Colors.theme,
		paddingHorizontal: 15,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1
	},
	defaultAvatar: {
		width: 68,
		height: 68,
		borderRadius: 34,
		backgroundColor: Colors.tintGray,
		justifyContent: 'center',
		alignItems: 'center'
	},
	userInfo: {
		marginTop: 65
	},
	headerInfo: {
		marginTop: 10,
		height: 50,
		justifyContent: 'space-between'
	},
	userName: {
		fontSize: 18,
		fontWeight: '500',
		color: Colors.darkFont
	},
	level: {
		color: Colors.white,
		fontSize: 12
	},
	progress: {
		height: 10,
		width: 150,
		backgroundColor: '#ffffff',
		borderRadius: 5,
		marginLeft: 10
		// borderWidth: 1,
		// borderColor: "#FE9900"
	}
});

export default NotLogin;
