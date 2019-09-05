/*
 * @flow
 * created by wyk made in 2019-03-21 13:59:58
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem, Avatar } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';

class GradeDescription extends Component {
	render() {
		let { navigation } = this.props;
		let user = navigation.getParam('user');
		let progress = (user.exp / user.next_level_exp) * 100 + '%';
		return (
			<PageContainer title="等级说明" white loading={!user}>
				<ScrollView style={styles.container} contentContainerStyle={styles.scrollStyle}>
					<View style={styles.userPanel}>
						<View style={{ paddingBottom: PxFit(15) }}>
							<Text style={styles.questionText}>下个等级所需经验:</Text>
						</View>
						<View style={styles.ticketUpperLimit}>
							<View style={[styles.ticketBar, { width: progress }]} />
						</View>
						<Row style={{ justifyContent: 'space-between' }}>
							<Text style={styles.levelText}>
								Lv.{user.level.level + ' '}({user.level.name})
							</Text>
							<Text style={styles.greyText}>
								{user.exp}/{user.next_level_exp}
							</Text>
						</Row>
					</View>
					<View style={{ paddingVertical: PxFit(15) }}>
						<View>
							<Text style={styles.questionText}>Q：头衔是什么？有什么作用？</Text>
							<Text style={styles.answerText}>
								A：用户的头衔是用户身份的象征，头衔会根据用户的等级进行变更。等级系统是用户积极答题活跃度的反馈，当用户的等级上升，精力点上限也会随之上升，并且升级还会有很多道具等其他的小奖励哦。
							</Text>
						</View>
					</View>
					<View style={{ paddingVertical: PxFit(15) }}>
						<View>
							<Text style={styles.questionText}>Q：如何升级？</Text>
							<Text style={styles.answerText}>
								A：如果你想要升级，就必须达到对应的经验值。经验值就是你答对题目的数量，答对一道题经验值+1。所以想要快快升级，就要提高自己答题的正确率哦。
							</Text>
						</View>
					</View>
					<View style={{ alignItems: 'center', marginTop: PxFit(10) }}>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>等级</Text>
							<Text style={styles.text}>头衔</Text>
							<Text style={styles.text}>经验值</Text>
							<Text style={styles.text}>精力点上限</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>9</Text>
							<Text style={styles.text}>登峰造极</Text>
							<Text style={styles.text}>20000</Text>
							<Text style={styles.text}>400</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>8</Text>
							<Text style={styles.text}>国士无双</Text>
							<Text style={styles.text}>10000</Text>
							<Text style={styles.text}>350</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>7</Text>
							<Text style={styles.text}>仁人名师</Text>
							<Text style={styles.text}>5000</Text>
							<Text style={styles.text}>320</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>6</Text>
							<Text style={styles.text}>为师有道</Text>
							<Text style={styles.text}>2000</Text>
							<Text style={styles.text}>300</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>5</Text>
							<Text style={styles.text}>学长师友</Text>
							<Text style={styles.text}>1000</Text>
							<Text style={styles.text}>280</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>4</Text>
							<Text style={styles.text}>有学而志</Text>
							<Text style={styles.text}>500</Text>
							<Text style={styles.text}>250</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>3</Text>
							<Text style={styles.text}>游学四方</Text>
							<Text style={styles.text}>200</Text>
							<Text style={styles.text}>220</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>2</Text>
							<Text style={styles.text}>小有所成</Text>
							<Text style={styles.text}>50</Text>
							<Text style={styles.text}>200</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.text}>1</Text>
							<Text style={styles.text}>初来乍到</Text>
							<Text style={styles.text}>0</Text>
							<Text style={styles.text}>180</Text>
						</View>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	scrollStyle: {
		flexGrow: 1,
		paddingHorizontal: PxFit(Theme.itemSpace),
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT || PxFit(Theme.itemSpace)
	},
	userPanel: {
		paddingVertical: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	ticketUpperLimit: {
		marginBottom: PxFit(5),
		height: PxFit(6),
		borderRadius: PxFit(3),
		backgroundColor: '#f0f0f0',
		overflow: 'hidden'
	},
	ticketBar: {
		alignSelf: 'auto',
		flex: 1,
		backgroundColor: Theme.primaryColor
	},
	levelText: {
		fontSize: PxFit(12),
		color: Theme.primaryColor
	},
	greyText: {
		fontSize: PxFit(12),
		color: Theme.subTextColor
	},
	userLevel: {
		fontSize: PxFit(12),
		color: Theme.subTextColor,
		fontWeight: '300',
		paddingTop: PxFit(3)
	},
	questionText: { fontSize: PxFit(15), color: Theme.defaultTextColor },
	answerText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		marginTop: PxFit(15),
		lineHeight: PxFit(18)
	},
	text: {
		borderWidth: 1,
		borderColor: Theme.borderColor,
		width: (SCREEN_WIDTH - PxFit(Theme.itemSpace * 2)) / 4,
		textAlign: 'center',
		paddingVertical: PxFit(10),
		fontSize: PxFit(13)
	}
});

export default GradeDescription;
