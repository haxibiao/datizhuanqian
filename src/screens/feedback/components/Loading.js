/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 15:43:59
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Theme, SCREEN_WIDTH, PxFit } from 'utils';

class Loading extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<View>
				<View style={styles.header}>
					<View style={styles.user}>
						<View
							style={{
								height: PxFit(34),
								width: PxFit(34),
								borderRadius: PxFit(17),
								backgroundColor: Theme.lightBorder
							}}
						/>
						<View style={styles.userRight}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text
									style={{
										height: PxFit(13),
										width: PxFit(80),
										backgroundColor: Theme.lightBorder
									}}
								/>
							</View>
							<Text style={{ height: PxFit(11), width: PxFit(40), backgroundColor: Theme.lightBorder }} />
						</View>
					</View>
				</View>
				<View style={styles.center}>
					<Text
						style={{
							width: SCREEN_WIDTH - PxFit(30),
							height: PxFit(14),
							backgroundColor: Theme.lightBorder,
							marginVertical: PxFit(4)
						}}
					/>

					<Text
						style={{
							width: SCREEN_WIDTH - PxFit(100),
							height: PxFit(14),
							backgroundColor: Theme.lightBorder,
							marginVertical: PxFit(4)
						}}
					/>
				</View>
				<View style={{ height: PxFit(5), backgroundColor: Theme.lightBorder }} />
				<View style={styles.commentsTab}>
					<Text style={{ fontSize: PxFit(16), color: Theme.black }}>评论 0</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: PxFit(15),
		paddingTop: PxFit(10)
	},

	user: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: PxFit(10)
	},
	userRight: {
		paddingLeft: PxFit(10),
		justifyContent: 'space-between',
		height: PxFit(34)
	},

	center: {
		marginTop: PxFit(15),
		paddingHorizontal: PxFit(15),
		paddingBottom: PxFit(20)
	},
	commentsTab: {
		paddingHorizontal: PxFit(15),
		paddingVertical: PxFit(10),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	}
});

export default Loading;
