/*
 * @flow
 * created by wyk made in 2018-12-05 20:53:57
 */
'use strict';
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Theme, PxFit, ISIOS, NAVBAR_HEIGHT } from '../../utils';
import StatusView from '../StatusView';
import NavigatorBar from '../Header/NavigatorBar';
import KeyboardSpacer from '../Utils/KeyboardSpacer';

type Props = {
	store?: Object, // redux screen state
	navBar?: any, // 导航条
	refetch?: Function,
	offline?: boolean,
	error?: boolean,
	loading?: boolean,
	empty?: boolean,
	children?: any,
	autoKeyboardInsets?: boolean, //键盘占位
	topInsets?: number,

	style?: any, // 外层View样式
	navBarStyle?: any, // 导航条样式
	contentViewStyle?: any, // 包裹层View样式

	isTopNavigator?: boolean, // 是否是顶层页面
	hiddenNavBar?: boolean,

	onLayout: Function,
	onWillFocus: Function,
	onDidFocus: Function,
	onWillBlur: Function,
	onDidBlur: Function,

	...NavigatorBar.Props
};

class PageContainer extends Component<Props> {
	static defaultProps = {
		hiddenNavBar: false,
		autoKeyboardInsets: true,
		topInsets: -Theme.HOME_INDICATOR_HEIGHT
	};
	renderContent() {
		const { offline, error, loading, empty, children, refetch } = this.props;
		if (offline) return <StatusView.ErrorView onPress={refetch} />;
		if (error) return <StatusView.ErrorView onPress={refetch} />;
		if (loading) return <StatusView.LoadingSpinner />;
		if (empty) return <StatusView.EmptyView />;
		return children;
	}

	renderNavBar() {
		const { navBar, isTopNavigator, navBarStyle, white, ...navBarProps } = this.props;
		let navView = null;
		if (typeof navBar === 'undefined') {
			navView = <NavigatorBar {...navBarProps} style={navBarStyle} isTopNavigator={isTopNavigator} />;
			if (white) {
				navView = (
					<NavigatorBar
						{...navBarProps}
						style={{
							backgroundColor: '#fff',
							borderBottomWidth: PxFit(0.5),
							borderBottomColor: Theme.borderColor
						}}
						titleStyle={{ color: Theme.defaultTextColor }}
						backButtonColor={Theme.defaultTextColor}
						isTopNavigator={isTopNavigator}
					/>
				);
			}
		} else {
			navView = navBar;
		}
		return navView;
	}

	render() {
		const {
			style,
			contentViewStyle,
			isTopNavigator,
			hiddenNavBar,
			autoKeyboardInsets,
			topInsets,
			onWillFocus,
			onDidFocus,
			onWillBlur,
			onDidBlur,
			loading,
			...props
		} = this.props;
		const marginTop = !hiddenNavBar ? PxFit(NAVBAR_HEIGHT) : 0;

		return (
			<View style={[styles.container, style]} {...props}>
				{!hiddenNavBar && this.renderNavBar()}
				<View style={[styles.contentView, { marginTop }, contentViewStyle]}>{this.renderContent()}</View>
				<KeyboardSpacer topInsets={topInsets} />
				<NavigationEvents
					onWillFocus={onWillFocus}
					onDidFocus={onDidFocus}
					onWillBlur={onWillBlur}
					onDidBlur={onDidBlur}
				/>
				{loading && <StatusView.LoadingSpinner />}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	contentView: {
		flex: 1
	}
});

export default PageContainer;
