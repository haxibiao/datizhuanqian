/*
 * @Author: Gaoxuan
 * @Date:   2019-05-09 09:44:13
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, Dimensions, Animated, Linking } from 'react-native';
import { PageContainer, TouchFeedback, PullChooser, Iconfont } from 'components';
import { Theme, SCREEN_WIDTH, PxFit, NAVBAR_HEIGHT, Config } from 'utils';

import { compose, withApollo, GQL } from 'apollo';
import { app } from 'store';
import { WebView } from 'react-native-webview';

class CpcTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0.1
		};
	}

	showOptions = () => {
		let { navigation } = this.props;
		let { adinfo_url } = navigation.state.params;

		PullChooser.show([
			{
				title: '用浏览器打开',
				onPress: () => Linking.openURL(adinfo_url)
			}
		]);
	};

	render() {
		const { navigation, client } = this.props;

		let { progress } = this.state;
		let { adinfo_url } = navigation.state.params;

		return (
			<PageContainer
				white
				rightView={
					<TouchFeedback style={styles.optionsButton} onPress={this.showOptions}>
						<Iconfont name="more-horizontal" color="#363636" size={PxFit(18)} />
					</TouchFeedback>
				}
			>
				<WebView
					source={{ uri: adinfo_url }}
					style={{ width: '100%', height: '100%' }}
					startInLoadingState={true}
					renderLoading={() => {
						return (
							<PageContainer
								style={{ marginTop: -PxFit(NAVBAR_HEIGHT) }}
								white
								rightView={
									<TouchFeedback style={styles.optionsButton} onPress={this.showOptions}>
										<Iconfont name="more-horizontal" color="#363636" size={PxFit(18)} />
									</TouchFeedback>
								}
							>
								<View
									style={{
										height: 2,
										width: SCREEN_WIDTH * progress,
										backgroundColor: Theme.theme
									}}
								/>
							</PageContainer>
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
						Toast.show({ content: '阅读完成,奖励已送达', layout: 'bottom' });
						client.query({
							query: GQL.UserMetaQuery,
							variables: { id: app.me.id },
							fetchPolicy: 'network-only'
						});
					}}
				/>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	optionsButton: {
		flex: 1,
		width: PxFit(40),
		alignItems: 'flex-end',
		justifyContent: 'center'
	}
});

export default compose(withApollo)(CpcTask);
