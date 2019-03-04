/*
 * @Author: Gaoxuan
 * @Date:   2019-03-04 11:12:55
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import { Colors } from '../../constants';
import { Screen, Avatar, DivisionLine, Button } from '../../components';

class Default extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [
				{
					id: 1,
					title: '中国最大的湖是',
					category: '地理知识',
					count: 999
				},
				{
					id: 2,
					title: '世界最大的湖是',
					category: '地理知识',
					count: 999
				},
				{
					id: 3,
					title: '最大的淡水湖是',
					category: '地理知识',
					count: 999
				},
				{
					id: 4,
					title: '最大的岛',
					category: '地理知识',
					count: 999
				},
				{
					id: 5,
					title: '中国地理面积最大的市',
					category: '地理知识',
					count: 999
				}
			]
		};
	}
	render() {
		return (
			<Screen
				customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
				routeName={'  '}
				iconColor={Colors.white}
			>
				<View style={styles.header}>
					<Button
						name={'关 注'}
						outline
						style={styles.button}
						textColor={Colors.white}
						fontSize={15}
						handler={() => {}}
					/>
				</View>
				<View style={styles.hederUser}>
					<View style={styles.row}>
						<Avatar
							uri={'http://cos.ainicheng.com/storage/avatar/270_1543393851.jpg'}
							size={68}
							borderStyle={{
								borderWidth: 2,
								borderColor: Colors.white
							}}
						/>
						<Text style={styles.levelText}>
							<Text style={{ fontSize: 12 }}>LV.</Text>5
						</Text>
					</View>
					<Text style={styles.nameText}>答题赚钱用户</Text>
					<Text style={styles.countText}>答题共99999次/出题被答88888次</Text>
				</View>
				<DivisionLine height={10} />
				<View>
					<View style={styles.footer}>
						<Text style={styles.footerTitle}>他的出题</Text>
					</View>
					<FlatList
						data={this.state.questions}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) => (
							<View
								style={{
									paddingVertical: 10,
									paddingHorizontal: 15,
									borderBottomWidth: 1,
									borderBottomColor: Colors.lightBorder
								}}
							>
								<Text style={{ fontSize: 15, color: Colors.black }}>{item.title}</Text>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
									<Text style={{ color: Colors.theme }}>#{item.category}</Text>
									<Text style={{ color: Colors.grey }}>共{item.count}人答过</Text>
								</View>
							</View>
						)}
					/>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: Colors.theme,
		height: 80,
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
	},
	button: {
		borderRadius: 5,
		paddingVertical: 3,
		paddingHorizontal: 15,
		borderWidth: 1,
		marginRight: 10,
		marginBottom: 5,
		borderColor: Colors.white
	},
	headerUser: {
		marginTop: -48,
		marginLeft: 30
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	levelText: {
		color: Colors.white,
		paddingHorizontal: 10,
		fontWeight: '600'
	},
	nameText: {
		fontSize: 16,
		fontWeight: '200',
		paddingVertical: 10,
		color: Colors.primaryFont
	},
	count: {
		color: Colors.grey,
		fontWeight: '200',
		paddingBottom: 10
	},
	footer: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		paddingHorizontal: 15,
		paddingVertical: 10
	},
	footerTitle: {
		color: Colors.primaryFont,
		fontSize: 16,
		fontWeight: '500'
	}
});

export default Default;
