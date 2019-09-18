/*
 * @Author: Gaoxuan
 * @Date:   2019-08-01 10:20:58
 */

import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { Theme, PxFit } from '../utils';
import { app } from 'store';

class TabBarComponent extends React.Component {
    renderItem = (route, index) => {
        const { navigation, onTabPress, renderIcon, activeTintColor, inactiveTintColor } = this.props;
        const focused = index === navigation.state.index;
        const color = focused ? activeTintColor : inactiveTintColor;
        const scene = {
            index,
            focused,
            route,
        };
        return (
            <TouchableWithoutFeedback key={route.key} onPress={() => onTabPress({ route })}>
                <View style={styles.tabItem}>
                    <View style={styles.icon}>
                        {renderIcon(scene)}
                        {route.key === '我的' && app.unreadNotice > 0 && <View style={styles.badge}></View>}
                    </View>
                    <Text style={{ fontSize: PxFit(10), color }}>{route.key}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        const { navigation } = this.props;
        const { routes, index: currentIndex } = navigation.state;
        const darkModel = currentIndex === 1;
        const routerItem = routes && routes.map((route, index) => this.renderItem(route, index));
        return <View style={[styles.tabBar, darkModel && styles.darkStyle]}>{routerItem}</View>;
    }
}

const styles = {
    tabBar: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: Theme.HOME_INDICATOR_HEIGHT + PxFit(50),
        borderTopWidth: PxFit(0.5),
        borderTopColor: Theme.borderColor,
        backgroundColor: '#fff',
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    darkStyle: {
        backgroundColor: '#000000',
        borderTopColor: '#000000',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    icon: {
        width: PxFit(28),
        height: PxFit(28),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 6,
        height: 6,
        backgroundColor: Theme.themeRed,
        borderRadius: 3,
    },
};

export default TabBarComponent;
