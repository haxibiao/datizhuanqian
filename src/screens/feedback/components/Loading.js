/*
 * @Author: Gaoxuan
 * @Date:   2019-02-27 10:51:31
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { DivisionLine } from '../../../components';
import { Colors, Divice } from '../../../constants';

class Loading extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<View>
				<View style={styles.header}>
					<Text
						style={{
							height: 20,
							width: Divice.width - 30,
							backgroundColor: Colors.lightBorder
						}}
					/>
					<View style={styles.user}>
						<View
							style={{
								height: 34,
								width: 34,
								borderRadius: 17,
								backgroundColor: Colors.lightBorder
							}}
						/>
						<View style={styles.userRight}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text
									style={{
										height: 13,
										width: 80,
										backgroundColor: Colors.lightBorder
									}}
								/>
							</View>
							<Text style={{ height: 11, width: 40, backgroundColor: Colors.lightBorder }} />
						</View>
					</View>
				</View>
				<View style={styles.center}>
					<Text
						style={{
							width: Divice.width - 30,
							height: 14,
							backgroundColor: Colors.lightBorder,
							marginVertical: 4
						}}
					/>

					<Text
						style={{
							width: Divice.width - 100,
							height: 14,
							backgroundColor: Colors.lightBorder,
							marginVertical: 4
						}}
					/>
				</View>
				<DivisionLine height={5} />
				<View style={styles.commentsTab}>
					<Text style={{ fontSize: 16, color: Colors.black }}>评论 0</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: 15,
		paddingTop: 20
	},

	user: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20
	},
	userRight: {
		paddingLeft: 10,
		justifyContent: 'space-between',
		height: 34
	},

	center: {
		marginTop: 15,
		paddingHorizontal: 15,
		paddingBottom: 20
	},
	commentsTab: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.lightBorder
	}
});

export default Loading;
