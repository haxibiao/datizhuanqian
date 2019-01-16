import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image, ScrollView } from 'react-native';

import Screen from '../Screen';
import { Colors, Config, Divice } from '../../constants';
import { DivisionLine, TabTop, ErrorBoundary } from '../../components/Universal';

const { width, height } = Dimensions.get('window');

class CommonIssueScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user
		};
	}
	render() {
		const { counts } = this.state;
		return (
			<Screen>
				<ScrollView style={styles.container}>
					<DivisionLine height={10} />
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：提现不了，怎么办？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：请先检查您的网络是否正常以及APP是否是最新版本或尝试重新登录，若还不能提现，请联系我们的官方微信或在意见反馈里提交，我们会在第一时间为您解决。
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：提现多久到账？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：提现会在3-5个工作日内到账,请及时留意您的支付宝到账信息哦。
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：精力点怎么获取？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：您好，系统默认初始值会有180点精力点，每天0点会重置精力点哦。
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：题目或者答案出现错误，怎么办?</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：可以到意见反馈中提供错误信息，我们收到您的错误信息会在最快的时间内对题目进行纠正哦
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：无法答题或查看信息,怎么办?</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：请先检查您的网络是否正常或者重新登录。
							</Text>
						</View>
					</View>

					{/*<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：怎么获得道具？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：您可以在道具商城用智慧点去购买您想要的道具，也可以在任务中心做任务来获取道具哦
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：道具有什么作用？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：我们的道具有很多种呢，您可以在道具商城看到所有道具的介绍哦。
							</Text>
						</View>
					</View>*/}
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：绑定支付宝账户是否会有风险？ </Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：绑定支付宝账户只是为了方便给您提现哦，除了您的支付宝账户，我们不会获取您支付宝的任何信息，完全不用担心会有风险哦。
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightBorder }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>Q：忘记密码了怎么办？</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15, lineHeight: 15 }}>
								A：您可以根据自己绑定的手机号码或者邮箱地址来找回密码或更改密码哦。
							</Text>
						</View>
					</View>
				</ScrollView>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default CommonIssueScreen;
