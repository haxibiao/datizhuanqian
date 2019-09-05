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
import SubmitLoading from '../Overlay/SubmitLoading';

type Props = {
	store?: Object, // redux screen state
	navBar?: any, // 导航条
	refetch?: Function,
	error?: boolean,
	loading?: boolean,
	submitting?: boolean,
	submitTips?: string,
	empty?: boolean,
	EmptyView: ?any,
	loadingSpinner: ?any,
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
		submitTips: '提交中...',
		topInsets: -Theme.HOME_INDICATOR_HEIGHT
	};
	renderContent() {
		const { error, loading, empty, loadingSpinner, EmptyView, children, refetch } = this.props;
		if (error) return <StatusView.ErrorView onPress={refetch} error={error} />;
		if (loading) return loadingSpinner || <StatusView.LoadingSpinner />;
		if (empty) return EmptyView || <StatusView.EmptyView />;
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
							borderBottomColor: Theme.borderColor,
							...navBarStyle
						}}
						statusBarStyle="dark-content"
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
			submitting,
			submitTips,
			...props
		} = this.props;
		const marginTop = !hiddenNavBar ? PxFit(NAVBAR_HEIGHT) : 0;

		return (
			<View style={[styles.container, style]} {...props}>
				{!hiddenNavBar && this.renderNavBar()}
				<View style={[styles.contentView, { marginTop }, contentViewStyle]}>{this.renderContent()}</View>
				{autoKeyboardInsets && <KeyboardSpacer topInsets={topInsets} />}
				<NavigationEvents
					onWillFocus={onWillFocus}
					onDidFocus={onDidFocus}
					onWillBlur={onWillBlur}
					onDidBlur={onDidBlur}
				/>
				<SubmitLoading isVisible={submitting} content={submitTips} />
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
