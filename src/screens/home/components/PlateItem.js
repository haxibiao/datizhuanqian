/*
 * @flow
 * created by wyk made in 2019-03-19 12:59:55
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, FlatList } from 'react-native';
import { Iconfont, Row, TouchFeedback } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

class PlateItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
	}

	onPress = () => {
		const { category, navigation } = this.props;
		navigation.navigate('Answer', { category, question_id: null });
	};

	render() {
		const { category, navigation } = this.props;
		const { show } = this.state;
		let { icon, name, description, children } = category;
		return (
			<View>
				<TouchFeedback
					authenticated
					navigation={navigation}
					style={[
						styles.container,
						children.length <= 0 && { borderBottomWidth: PxFit(0.5), borderBottomColor: Theme.borderColor }
					]}
					onPress={this.onPress}
				>
					<Image source={{ uri: icon }} style={styles.cover} />
					<View style={{ flex: 1, paddingHorizontal: PxFit(15) }}>
						<Text style={styles.name}>{name}</Text>
						<Text style={styles.description} numberOfLines={1}>
							{description}
						</Text>
					</View>
					<TouchFeedback>
						<Iconfont name={'right'} size={16} color={Theme.secondaryTextColor} />
					</TouchFeedback>
				</TouchFeedback>
				{children.length > 0 && (
					<FlatList
						data={children}
						keyExtractor={(item, index) => (item.id ? item.id.toString() + Date.now() : index.toString())}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item, index }) => (
							<TouchFeedback
								authenticated
								navigation={navigation}
								style={{ paddingVertical: PxFit(10) }}
								onPress={() => navigation.navigate('Answer', { category: item, question_id: null })}
								key={index}
							>
								<View style={styles.item}>
									<Text style={styles.minText}>{item.name}</Text>
								</View>
							</TouchFeedback>
						)}
					/>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: PxFit(15)
	},
	cover: {
		width: PxFit(48),
		height: PxFit(48),
		borderRadius: PxFit(5),
		backgroundColor: '#f0f0f0'
	},
	name: {
		fontSize: PxFit(16),
		fontWeight: '400',
		color: Theme.defaultTextColor
	},
	description: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		paddingTop: PxFit(5)
	},
	childrenContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.borderColor
	},
	item: {
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: (SCREEN_WIDTH - PxFit(75)) / 3.5,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: '#FAF0E6',
		marginLeft: PxFit(15)
	},
	img: {
		width: PxFit(40),
		height: PxFit(40),
		borderRadius: PxFit(20),
		backgroundColor: '#f0f0f0'
	},
	minText: {
		fontSize: 12,
		// paddingTop: 6,
		color: Theme.grey
	}
});

export default PlateItem;
