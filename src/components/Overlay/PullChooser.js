/*
 * @flow
 * created by wyk made in 2018-12-13 11:43:52
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Overlay } from 'teaset';
import SafeText from '../Basics/SafeText';
import TouchFeedback from '../TouchableView/TouchFeedback';
import ItemSeparator from '../List/ItemSeparator';

import { Theme, PxFit, SCREEN_WIDTH, ISIOS } from '../../utils';

type ChooserItem = {
	title: string,
	onPress: Function
};

class PullChooser {
	static show(Choose: Array<ChooserItem>) {
		let overlayView = (
			<Overlay.PullView
				containerStyle={{ backgroundColor: 'transparent' }}
				style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
				animated
				ref={ref => (this.popViewRef = ref)}
			>
				<View style={styles.actionSheetView}>
					<FlatList
						bounces={false}
						scrollEnabled={false}
						contentContainerStyle={styles.chooseContainer}
						data={Choose}
						renderItem={({ item, index }) => {
							return (
								<TouchFeedback
									key={index}
									style={styles.chooserItem}
									onPress={() => {
										item.onPress();
										this.popViewRef.close();
									}}
								>
									<SafeText style={styles.chooserItemText}>{item.title}</SafeText>
								</TouchFeedback>
							);
						}}
						ItemSeparatorComponent={() => <ItemSeparator height={PxFit(1)} />}
						keyExtractor={(item, index) => 'key_' + (item.id ? item.id : index)}
					/>
					<TouchFeedback
						style={styles.closeItem}
						onPress={() => {
							this.popViewRef.close();
						}}
					>
						<Text style={styles.headerText}>取消</Text>
					</TouchFeedback>
				</View>
			</Overlay.PullView>
		);
		this.OverlayKey = Overlay.show(overlayView);
	}

	static hide() {
		Overlay.hide(this.OverlayKey);
	}
}

const styles = StyleSheet.create({
	actionSheetView: {
		padding: PxFit(Theme.itemSpace),
		marginBottom: Theme.HOME_INDICATOR_HEIGHT,
		overflow: 'hidden'
	},
	chooseContainer: {
		borderRadius: PxFit(6),
		backgroundColor: '#fff'
	},
	chooserItem: {
		height: PxFit(46),
		justifyContent: 'center'
	},
	chooserItemText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		textAlign: 'center'
	},
	headerText: {
		fontSize: PxFit(15),
		color: Theme.confirmColor,
		textAlign: 'center'
	},
	closeItem: {
		height: PxFit(46),
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderRadius: PxFit(6),
		marginTop: PxFit(Theme.itemSpace)
	}
});

export default PullChooser;
