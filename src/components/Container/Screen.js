import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import Header from '../../components';

class Screen extends Component {
	render() {
		let {
			customStyle = {},
			lightBar,
			header = false,
			headerLeft = false,
			routeName,
			headerRight,
			backHandler
		} = this.props;
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: '#ffffff'
				}}
			>
				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={lightBar ? 'light-content' : 'dark-content'}
				/>
				{header ? (
					header
				) : (
					<Header
						headerLeft={headerLeft}
						customStyle={customStyle}
						routeName={routeName}
						headerRight={headerRight}
						backHandler={backHandler}
					/>
				)}
				{this.props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default Screen;
