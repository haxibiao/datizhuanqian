/*
 * @flow
 * created by wyk made in 2018-12-06 10:00:20
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Animated,
    ViewPropTypes,
    Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import Iconfont from '../Iconfont';
import { PxFit, Theme, NAVBAR_HEIGHT } from '../../utils';

class NavigatorBar extends Component {
    static propTypes = {
        ...ViewPropTypes,
        isTopNavigator: PropTypes.bool, //whether the page is initialized
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        titleStyle: PropTypes.object,
        titleViewStyle: PropTypes.object,
        backButtonPress: PropTypes.func,
        backButtonColor: PropTypes.string,
        leftView: PropTypes.element,
        rightView: PropTypes.element,
        sideViewStyle: PropTypes.object,
        hidden: PropTypes.bool, //bar hidden
        animated: PropTypes.bool, //hide or show bar with animation
        statusBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
        statusBarColor: PropTypes.string,
        statusBarHidden: PropTypes.bool, //status bar hidden
    };

    static defaultProps = {
        ...View.defaultProps,
        isTopNavigator: false,
        hidden: false,
        animated: true,
        statusBarStyle: 'dark-content',
    };

    constructor(props) {
        super(props);
        this.screenWidth = Dimensions.get('window').width;
        this.state = {
            barOpacity: new Animated.Value(props.hidden ? 0 : 1),
        };
    }

    buildProps() {
        let { style, title, titleStyle, titleViewStyle, statusBarColor, sideViewStyle, ...others } = this.props;

        //build style
        style = {
            backgroundColor: Theme.navBarBackground,
            position: 'absolute',
            left: 0,
            right: 0,
            height: PxFit(NAVBAR_HEIGHT),
            paddingTop: PxFit(Theme.statusBarHeight),
            paddingLeft: PxFit(Theme.itemSpace),
            paddingRight: PxFit(Theme.itemSpace),
            borderBottomWidth: PxFit(0.5),
            borderBottomColor: Theme.navBarSeparatorColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...style,
        };

        if (!statusBarColor) statusBarColor = Theme.navBarBackground;

        //build titleViewStyle
        titleViewStyle = {
            position: 'absolute',
            top: PxFit(Theme.statusBarHeight),
            left: PxFit(Theme.itemSpace),
            right: PxFit(Theme.itemSpace),
            bottom: 0,
            opacity: this.state.barOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...titleViewStyle,
        };

        //build leftView and rightView style
        sideViewStyle = {
            opacity: this.state.barOpacity,
            alignSelf: 'stretch',
            ...sideViewStyle,
        };

        //convert string title to NavigatorBar.Title
        if (typeof title === 'string') {
            title = (
                <Text style={[styles.titleText, titleStyle]} numberOfLines={1}>
                    {title}
                </Text>
            );
        }

        return {
            style,
            title,
            titleViewStyle,
            statusBarColor,
            sideViewStyle,
            ...others,
        };
    }

    backButtonPress = () => {
        const { backButtonPress, navigation } = this.props;
        if (backButtonPress) {
            backButtonPress();
        } else {
            navigation.goBack();
        }
    };

    renderLeftView = () => {
        const { isTopNavigator, leftView, backButtonColor } = this.props;
        let left;
        if (isTopNavigator || leftView) {
            left = leftView;
        } else {
            left = (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.backButtonPress}
                    style={{
                        flex: 1,
                        width: Theme.navBarContentHeight,
                        justifyContent: 'center',
                    }}>
                    <Iconfont name="left" color={backButtonColor || Theme.navBarTitleColor} size={PxFit(21)} />
                </TouchableOpacity>
            );
        }
        return left;
    };

    onLayout(e) {
        if (e.nativeEvent.layout.height != this.barHeight) {
            this.barHeight = e.nativeEvent.layout.height;
        }
        let { width } = Dimensions.get('window');
        if (width != this.screenWidth) {
            this.screenWidth = width;
            this.forceUpdate();
        }
        this.props.onLayout && this.props.onLayout(e);
    }

    render() {
        let {
            style,
            animated,
            statusBarStyle,
            statusBarColor,
            statusBarHidden,
            title,
            titleViewStyle,
            sideViewStyle,
            rightView,
            ...others
        } = this.buildProps();
        return (
            <Animated.View style={style} {...others} onLayout={e => this.onLayout(e)}>
                <StatusBar
                    translucent={true}
                    backgroundColor={statusBarColor}
                    barStyle={statusBarStyle}
                    animated={animated}
                    hidden={statusBarHidden}
                />
                <Animated.View style={titleViewStyle}>{title}</Animated.View>
                <Animated.View style={sideViewStyle}>{this.renderLeftView()}</Animated.View>
                <Animated.View style={sideViewStyle}>{rightView}</Animated.View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: PxFit(17),
        textAlign: 'center',
        color: Theme.navBarTitleColor,
    },
});

export default withNavigation(NavigatorBar);
