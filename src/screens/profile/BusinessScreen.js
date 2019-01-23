import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, Dimensions, Animated } from 'react-native';
import { DivisionLine, ErrorBoundary, ContentEnd, Button, Header, Screen } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { connect } from 'react-redux';

import { WebView } from 'react-native-webview';

class BusinessScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0.1
		};
	}

	render() {
		let { progress } = this.state;
		console.log('progress', progress);
		return (
			<Screen>
				<WebView
					source={{ uri: 'https://datizhuanqian.com/' }}
					style={{ width: '100%', height: '100%' }}
					startInLoadingState={true}
					renderLoading={() => {
						return (
							<View
								style={{ height: 2, width: Divice.width * progress, backgroundColor: Colors.theme }}
							/>
						);
					}}
					onLoadStart={() => {
						this.setState({
							progress: 0.2
						});
						setTimeout(() => {
							this.setState({
								progress: 0.4
							});
						}, 100);
						setTimeout(() => {
							this.setState({
								progress: 0.8
							});
						}, 200);
					}}
					onLoadEnd={() => {
						this.setState({
							progress: 0
						});
					}}
				/>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 74,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default BusinessScreen;
