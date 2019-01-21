import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Screen } from '../../../components';
import { Colors, Config, Divice } from '../../../constants';

import { connect } from 'react-redux';
import actions from '../../../store/actions';

class AboutScreen extends Component {
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
				<View style={styles.container}>
					<View style={{ alignItems: 'center', marginTop: 15 }}>
						<Image
							source={require('../../../../assets/images/logo.png')}
							style={{ width: Divice.width / 4, height: Divice.width / 4 }}
						/>
						<Text style={{ color: Colors.black, fontSize: 15, margin: 20 }}>
							答题赚钱 {Config.AppVersion}
						</Text>
					</View>
					<View style={{ marginTop: 30 }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>关于答题</Text>
							<Text
								style={{
									fontSize: 13,
									color: Colors.grey,
									marginTop: 15,
									lineHeight: 18,
									fontWeight: '300'
								}}
							>
								答题赚钱是一款手机休闲益智答题软件,有地理，英文，历史，科学，世界趣闻等知识分类。
								答题题目将不断更新，让您随时学到新的知识。成功答题的您还能获得收益哦！在等朋友,等公交,等吃饭或其他碎片时间。
								玩答题赚钱学知识拿金钱，是您killtime的最佳搭档。如果你觉得你掌握的知识够全面就快来答题赚钱吧，各国趣味知识，涵盖天文、地理、历史科学应有尽有。
								只要你能答对就能赚取相应报酬，快来答题赚钱试试身手吧。
							</Text>
						</View>
					</View>
					<View style={{ marginTop: 30 }}>
						<View style={{ paddingHorizontal: 20 }}>
							<Text style={{ fontSize: 15, color: Colors.black }}>联系我们</Text>
							{/*<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 15 }}>QQ交流群: 4337413</Text>*/}
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 10 }}>
								官网地址: datizhuanqian.com datizhuanqian.cn
							</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 10 }}>
								官方邮箱: dtzq@haxibiao.com
							</Text>
							<Text style={{ fontSize: 13, color: Colors.grey, marginTop: 10 }}>官方QQ群: 629879388</Text>
						</View>
					</View>
				</View>
				<View style={{ backgroundColor: Colors.lightGray, paddingVertical: 15, alignItems: 'center' }}>
					<Text>哈希表网络科技(深圳)有限公司</Text>
					<Text>www.datizhuanqian.com</Text>
				</View>
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

export default connect(store => {
	return {
		user: store.users.user
	};
})(AboutScreen);
