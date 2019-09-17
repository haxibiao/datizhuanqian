/*
 * @Author: Gaoxuan
 * @Date:   2019-04-22 11:20:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';

class Introduce extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user
		};
	}
	render() {
		const { counts } = this.state;
		return (
			<PageContainer title="答题须知" white>
				<ScrollView
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<Row>
									<View style={styles.badge} />
									<Text style={{ fontSize: PxFit(16), color: '#000', marginLeft: PxFit(10) }}>
										什么是智慧点？
									</Text>
								</Row>
								<Image
									source={require('../../assets/images/diamond.png')}
									style={{
										width: PxFit(23),
										height: PxFit(25),
										marginLeft: 5
									}}
								/>
							</Row>

							<Text style={styles.answerText}>
								智慧点是{Config.AppName}用户的虚拟积分，可以兑换一定数量的红包、购买专区免广告服务。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<Row>
									<View style={styles.badge} />
									<Text style={{ fontSize: PxFit(16), color: '#000', marginLeft: PxFit(10) }}>
										如何获取智慧点？
									</Text>
								</Row>
								<Image
									source={require('../../assets/images/diamond.png')}
									style={{
										width: PxFit(23),
										height: PxFit(25),
										marginLeft: 5
									}}
								/>
							</Row>

							<Text style={styles.answerText}>
								在精力点足够的情况下，能够通过答题、出题获取，同时也能通过任务获取。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<Row>
									<View style={styles.badge} />
									<Text style={{ fontSize: 16, color: '#000', marginLeft: PxFit(10) }}>
										什么是精力点？
									</Text>
								</Row>
								<Image
									source={require('../../assets/images/heart.png')}
									style={{
										width: PxFit(23),
										height: PxFit(25),
										marginLeft: 5
									}}
								/>
							</Row>
							<Text style={styles.answerText}>
								精力点是控制答题和出题获取奖励的虚拟道具，拥有精力点时，答题、审题、出题，才会给予智慧点、贡献奖励。如果没有精力点，答题将不再奖励智慧点。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<Row>
									<View style={styles.badge} />
									<Text style={{ fontSize: 16, color: '#000', marginLeft: PxFit(10) }}>
										如何获取精力点？
									</Text>
								</Row>
								<Image
									source={require('../../assets/images/heart.png')}
									style={{
										width: PxFit(23),
										height: PxFit(25),
										marginLeft: 5
									}}
								/>
							</Row>
							<Text style={styles.answerText}>
								每个账号默认会有180点精力点，根据等级的提升会增加精力点上限，同时每天会重置精力点数。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<Row>
									<View style={styles.badge} />
									<Text style={{ fontSize: 16, color: '#000', marginLeft: PxFit(10) }}>
										什么是贡献值？
									</Text>
								</Row>
								<Image
									source={require('../../assets/images/gongxian.png')}
									style={{
										width: PxFit(18),
										height: PxFit(18),
										marginLeft: 5
									}}
								/>
							</Row>
							<Text style={styles.answerText}>
								贡献值代表用户对{Config.AppName}
								创建良好用户环境所做的贡献，为保证社区用户环境良好，提现时需要考核用户的贡献值。
								{/*兑换越多需要的贡献越多。*/}
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<Row>
									<View style={styles.badge} />
									<Text style={{ fontSize: 16, color: '#000', marginLeft: PxFit(10) }}>
										如何获取贡献值？
									</Text>
								</Row>
								<Image
									source={require('../../assets/images/gongxian.png')}
									style={{
										width: PxFit(18),
										height: PxFit(18),
										marginLeft: 5
									}}
								/>
							</Row>
							<Text style={styles.answerText}>
								贡献值可以通过举报违反出题规则的题目、做激励任务、发布有价值的神评论(被点赞)等方式获取。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<View style={styles.badge} />
								<Text style={{ fontSize: 16, color: '#000', marginLeft: PxFit(10) }}>
									什么是经验值？如何获取经验值？
								</Text>
							</Row>

							<Text style={styles.answerText}>
								经验值能够影响用户的等级，经验值可以通过答题、审题、出题等获取。获取经验值会提升等级、增加精力点上限。享受更多荣誉和权益。
							</Text>
						</View>
					</View>
					<View style={styles.issueItem}>
						<View style={styles.issuePH}>
							<Row>
								<View style={styles.badge} />
								<Text style={{ fontSize: 16, color: '#000', marginLeft: PxFit(10) }}>
									如何提升提现额度？
								</Text>
							</Row>
							<Text style={styles.answerText}>赚取贡献点既可提升提现额度。</Text>
						</View>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
		paddingTop: 15
	},
	badge: {
		backgroundColor: '#000',
		height: PxFit(8),
		width: PxFit(8),
		borderRadius: PxFit(4)
	},
	issueItem: {
		paddingVertical: PxFit(10),
		backgroundColor: '#fff'
	},
	issuePH: {
		paddingHorizontal: PxFit(20)
	},
	questionText: {
		fontSize: PxFit(16),
		fontWeight: '500',
		color: Theme.defaultTextColor,
		textAlign: 'center'
	},
	answerText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		marginTop: PxFit(15),
		lineHeight: PxFit(20),
		paddingLeft: PxFit(20)
	}
});

export default Introduce;
