import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image, Text } from 'react-native';
import { Colors, Config, Divice } from '../../constants';
import { DivisionLine, Button, Iconfont, Screen, Input } from '../../components';
import HTML from 'react-native-render-html';

const htmlContent = `
   <p>在阵容方面，Liquid战队坐拥5星英雄谜团与3星英雄剧毒术士。和自走棋内的设定相同，谜团在团战方面表现出色，而能够释放召唤技能的剧毒术士同样可攻可守。</p>
`;

class TaskDetailsScreen extends Component {
	render() {
		this.imgKey = 0;
		return (
			<Screen>
				<ScrollView style={{ flex: 1 }}>
					<DivisionLine height={5} />
					<View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingTop: 20,
								paddingBottom: 10
							}}
						>
							<View style={{ height: 22, width: 10, backgroundColor: Colors.theme, marginRight: 15 }} />
							<Text style={{ color: Colors.primaryFont, fontSize: 18 }}>小米应用商店评论</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingTop: 5,
								paddingBottom: 20,
								marginHorizontal: 20
							}}
						>
							<Iconfont name={'zhuanshi'} size={22} color={Colors.theme} />
							<Text style={{ fontSize: 20, color: Colors.theme, paddingLeft: 5 }}>
								600<Text style={{ fontSize: 19 }}>智慧点</Text>
							</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',

								paddingBottom: 20,
								marginHorizontal: 25,
								justifyContent: 'space-between'
							}}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image
									source={require('../../../assets/images/time.png')}
									style={{ height: 15, width: 15, marginRight: 10 }}
								/>
								<Text>2019-01-25截止</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image
									source={require('../../../assets/images/audit.png')}
									style={{ height: 15, width: 15, marginRight: 10 }}
								/>
								<Text>预计审核时间72小时</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingVertical: 20
						}}
					>
						<View style={{ height: 22, width: 10, backgroundColor: Colors.theme, marginRight: 15 }} />
						<Text style={{ color: Colors.primaryFont, fontSize: 18 }}>任务简介</Text>
					</View>
					<View
						style={{
							marginHorizontal: 15,
							borderTopWidth: 1,
							borderTopColor: Colors.lightBorder
						}}
					>
						<HTML
							html={htmlContent}
							imagesMaxWidth={Divice.width - 30}
							baseFontStyle={{
								fontSize: 15,
								color: Colors.primaryFont
							}}
							renderers={{
								img: (htmlAttribs, children, passProps) => {
									// 获取当前index
									let index = this.imgKey;
									this.imgKey++;
									let width = htmlAttribs.width ? parseInt(htmlAttribs.width) : Divice.width - 30;
									let height = htmlAttribs.height ? parseInt(htmlAttribs.height) : Divice.width - 30;
									let size = imageSize({ width, height });

									return (
										<TouchableOpacity
											activeOpacity={1}
											key={index}
											onPress={() => {
												this.initImage = index;
												this.setState({
													imageViewerVisible: true
												});
											}}
											style={{ alignItems: 'center' }}
										>
											<Image
												source={{ uri: htmlAttribs.src }}
												style={{
													width: size.width,
													height: size.height,
													resizeMode: 'cover'
												}}
												{...passProps}
											/>
										</TouchableOpacity>
									);
								}
							}}
						/>
					</View>
				</ScrollView>
			</Screen>
		);
	}
}

function imageSize({ width, height }) {
	var size = {};
	if (width > Divice.width) {
		size.width = Divice.width - 30;
		size.height = ((Divice.width - 30) * height) / width;
	} else {
		size = { width, height };
	}
	return size;
}

const styles = StyleSheet.create({});

export default TaskDetailsScreen;
