import React, { Component } from "react";
import { StyleSheet, Text, View, Animated, TouchableNativeFeedback, TouchableOpacity, Platform } from "react-native";

import { Colors, Divice } from "../../constants";

export default class CustomTabBar extends Component {
	constructor(props: TabBarProps) {
		super(props);
	}

	_renderTab(name, page, isTabActive, onPressHandler) {
		const { activeColor = Colors.darkFont, inactiveColor = Colors.tintFont, tabStyle = { flex: 1 } } = this.props;
		const textColor = isTabActive ? activeColor : inactiveColor;

		const Button = Platform.OS == "ios" ? ButtonIos : ButtonAndroid;

		return (
			<Button
				style={tabStyle}
				key={name}
				accessible={true}
				accessibilityLabel={name}
				accessibilityTraits="button"
				onPress={() => onPressHandler(page)}
			>
				<View style={styles.tab}>
					<Text style={[{ color: textColor, fontSize: 14 }]}>{name}</Text>
				</View>
			</Button>
		);
	}

	_renderUnderline() {
		//容器宽度，tabs=>array ，indicator style 。。，activeColor，scroll系数
		const {
			containerWidth,
			tabs,
			tabUnderlineWidth,
			tabUnderlineScaleX,
			underLineColor = Colors.theme,
			scrollValue
		} = this.props;
		const numberOfTabs = tabs.length;
		const underlineWidth = tabUnderlineWidth ? tabUnderlineWidth : containerWidth / (numberOfTabs * 2);
		const scale = tabUnderlineScaleX ? tabUnderlineScaleX : 3;
		const deLen = (containerWidth / numberOfTabs - underlineWidth) / 2;
		const tabUnderlineStyle = {
			position: "absolute",
			width: underlineWidth,
			height: 2,
			borderRadius: 2,
			backgroundColor: underLineColor,
			bottom: 0,
			left: deLen
		};

		const translateX = scrollValue.interpolate({
			inputRange: [0, 1],
			outputRange: [0, containerWidth / numberOfTabs]
		});

		// 计算scaleX对应系数
		const scaleValue = defaultScale => {
			let number = 4;
			let arr = new Array(number * 2);
			return arr.fill(0).reduce(
				function(pre, cur, idx) {
					idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx - 1] + 0.5);
					idx % 2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1);
					return pre;
				},
				{ inputRange: [], outputRange: [] }
			);
		};

		const scaleX = scrollValue.interpolate(scaleValue(scale));

		return (
			<Animated.View
				style={[
					tabUnderlineStyle,
					{
						transform: [{ translateX }, { scaleX }]
					},
					this.props.underlineStyle
				]}
			/>
		);
	}

	render() {
		return (
			<View style={[styles.tabs, { backgroundColor: this.props.backgroundColor }, this.props.style]}>
				{this.props.tabs.map((name, page) => {
					const isTabActive = this.props.activeTab === page;
					return this._renderTab(name, page, isTabActive, this.props.goToPage);
				})}
				{this._renderUnderline()}
			</View>
		);
	}
}

const ButtonAndroid = props => (
	<TouchableNativeFeedback delayPressIn={0} background={TouchableNativeFeedback.SelectableBackground()} {...props}>
		{props.children}
	</TouchableNativeFeedback>
);

const ButtonIos = props => <TouchableOpacity {...props}>{props.children}</TouchableOpacity>;

const styles = StyleSheet.create({
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	tabs: {
		height: 50,
		flexDirection: "row",
		justifyContent: "space-around",
		borderWidth: 1,
		borderTopWidth: 0,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		borderColor: "#f4f4f4"
	}
});
