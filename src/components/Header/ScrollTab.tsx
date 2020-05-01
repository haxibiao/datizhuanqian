import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { observer, app } from 'store';

const ScrollTab = observer(props => {
    const { containerWidth, tabWidth, tabs } = props;
    const numberOfTabs = tabs.length;
    const underlineWidth = useMemo(() => {
        if (props.underlineWidth) {
            return props.underlineWidth;
        } else {
            return tabWidth ? tabWidth * 0.6 : (containerWidth / numberOfTabs) * 0.6;
        }
    }, []);
    const underLinePaddingHorizontal = useMemo(() => {
        if (tabWidth) {
            return (tabWidth - underlineWidth) / 2;
        } else {
            return (containerWidth / numberOfTabs - underlineWidth) / 2;
        }
    }, []);
    const underlineScaleX = props.underlineScaleX ? props.underlineScaleX : 2;

    // 计算scaleX动画系数
    const scaleValue = useCallback(defaultScale => {
        const number = 5;
        const arr = new Array(number * 2);
        return arr.fill(0).reduce(
            function(pre, cur, idx) {
                idx === 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx - 1] + 0.5);
                idx % 2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1);
                return pre;
            },
            { inputRange: [], outputRange: [] },
        );
    }, []);

    // ————view————

    const Tabs = useMemo(() => {
        return props.tabs.map((name, page) => {
            const isActive = props.activeTab === page;
            const tabStyle = tabWidth ? { width: tabWidth } : { flex: 1 };
            const changeTextStyle = isActive ? props.activeTextStyle : props.inactivityTextStyle;

            return (
                <TouchableOpacity
                    style={[styles.tabStyle, props.tabStyle, tabStyle]}
                    key={name}
                    onPress={() => props.goToPage(page)}>
                    {props.renderTabItem ? (
                        props.renderTabItem({ name, page, isActive })
                    ) : (
                        <Animated.Text style={[styles.textStyle, props.textStyle, changeTextStyle]}>
                            {name}
                        </Animated.Text>
                    )}
                </TouchableOpacity>
            );
        });
    }, [props]);

    const UnderLine = useMemo(() => {
        if (props.hiddenUnderLine) {
            return null;
        }
        const scrollUnderlineStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            ...props.scrollUnderlineStyle,
        };
        const underlineStyle = {
            width: underlineWidth,
            height: props.underlineHeight,
            borderRadius: props.underlineHeight,
            backgroundColor: 'yellow',
            marginHorizontal: underLinePaddingHorizontal,
            ...props.underlineStyle,
        };
        const translateX = props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, tabWidth ? tabWidth : containerWidth / numberOfTabs],
        });
        const scaleX = props.scrollValue.interpolate(scaleValue(underlineScaleX));
        return (
            <View style={scrollUnderlineStyle}>
                <Animated.View
                    style={[
                        underlineStyle,
                        {
                            transform: [{ translateX }, { scaleX }],
                        },
                    ]}
                />
            </View>
        );
    }, [props]);

    return (
        <Animated.View style={[styles.tabBar, props.style]}>
            {Tabs}
            {UnderLine}
        </Animated.View>
    );
});

ScrollTab.defaultProps = {
    activeTextStyle: { color: Theme.defaultTextColor },
    inactiveTextStyle: { color: Theme.subTextColor },
    underlineHeight: PxFit(1),
    hiddenUnderLine: false,
};

export default ScrollTab;

const styles = StyleSheet.create({
    tabBar: {
        alignItems: 'stretch',
        borderColor: Theme.borderColor,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        flexDirection: 'row',
        height: PxFit(Device.statusBarHeight),
    },
    tabStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        fontSize: PxFit(16),
    },
});
