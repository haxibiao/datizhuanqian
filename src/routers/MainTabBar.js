/*
 * @flow
 * created by wyk made in 2018-12-06 20:16:58
 */
import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { Theme, PxFit } from '../utils';

class TabBarComponent extends React.Component {
	renderItem = (route, index) => {
		const { navigation, onTabPress, renderIcon, login, activeTintColor, inactiveTintColor, getLabel } = this.props;
		const focused = index === navigation.state.index;
		const color = focused ? activeTintColor : inactiveTintColor;
		const scene = {
			index,
			focused,
			route
		};
		return (
			<TouchableWithoutFeedback key={route.key} onPress={() => onTabPress({ route })}>
				<View style={styles.tabItem}>
					<View style={styles.icon}>{renderIcon(scene)}</View>
					<Text style={{ fontSize: PxFit(10), color }}>{route.key}</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	// renderPublis() {
	// 	const { navigation, login } = this.props;
	// 	return (
	// 		<TouchableWithoutFeedback key="publis" onPress={() => navigation.navigate(login ? 'Publish' : 'Login')}>
	// 			<View style={styles.tabItem}>
	// 				<Image source={require('../../public/images/publish.png')} style={{ width: 42, height: 42 }} />
	// 			</View>
	// 		</TouchableWithoutFeedback>
	// 	);
	// }

	render() {
		const { navigation } = this.props;
		let { routes } = navigation.state;
		// let publisItem = this.renderPublis();
		let routerItem = routes && routes.map((route, index) => this.renderItem(route, index));
		// routerItem.splice(2, 0, publisItem);
		return <View style={styles.tabBar}>{routerItem}</View>;
	}
}

const styles = {
	tabBar: {
		flexDirection: 'row',
		alignItems: 'stretch',
		height: Theme.HOME_INDICATOR_HEIGHT + PxFit(50),
		borderTopWidth: PxFit(0.5),
		borderTopColor: Theme.borderColor,
		backgroundColor: '#fff',
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative'
	},
	icon: { width: PxFit(28), height: PxFit(28), alignItems: 'center', justifyContent: 'center' }
};

export default TabBarComponent;
