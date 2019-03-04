import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import Header from '../Header/Header';

class Screen extends Component {
	render() {
		let {
			customStyle = {},
			lightBar,
			header = false,
			headerLeft = false,
			routeName,
			headerRight,
			backHandler,
			iconColor
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
						iconColor={iconColor}
					/>
				)}
				{this.props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default Screen;
