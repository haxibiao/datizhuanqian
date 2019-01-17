import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

import { Colors, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

class Header extends React.Component {
	render() {
		let { routeName, headerLeft, headerRight, navigation, customStyle = {}, backHandler } = this.props;
		return (
			<View style={[styles.header, customStyle]}>
				{headerLeft ? (
					headerLeft
				) : (
					<TouchableOpacity
						activeOpacity={1}
						style={[styles.side, { width: 40, left: 15 }]}
						onPress={() => {
							if (backHandler) {
								backHandler();
							} else {
								navigation.goBack();
							}
						}}
					>
						<Iconfont name={'left'} size={19} color={Colors.primaryFont} />
					</TouchableOpacity>
				)}

				<View style={styles.title}>
					<Text style={styles.routeName}>{routeName ? routeName : navigation.state.routeName}</Text>
				</View>

				{headerRight && <View style={[styles.side, { right: 15 }]}>{headerRight}</View>}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: Divice.STATUSBAR_HEIGHT + 46,
		paddingTop: Divice.STATUSBAR_HEIGHT,
		paddingHorizontal: 15,
		backgroundColor: Colors.white
	},
	side: {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		bottom: 2
	},
	title: {
		flex: 1,
		marginHorizontal: 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	routeName: {
		fontSize: 16,
		color: Colors.black
	}
});

export default withNavigation(Header);
