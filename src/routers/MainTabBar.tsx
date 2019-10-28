/*
 * @Author: Gaoxuan
 * @Date:   2019-08-01 10:20:58
 */

import React from 'react';
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native';
import { Theme, PxFit } from '../utils';
import { app } from 'store';
import { observer } from 'mobx-react';

@observer
class TabBarComponent extends React.Component {
    public renderItem = (route: any, index: number) => {
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
                        {route.key === '我的' && app.unreadNotice > 0 && <View style={styles.badge} />}
                    </View>
                    <Text style={{ fontSize: PxFit(10), color }}>{route.key}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    public render() {
        const { navigation } = this.props;
        const { routes, index: currentIndex } = navigation.state;

        const lightModel = currentIndex === 2;
        const routerItem = routes && routes.map((route, index) => this.renderItem(route, index));

        return (
            <View style={[styles.tabBar, lightModel && styles.lightStyle, app.modalIsShow && styles.hidden]}>
                {routerItem}
            </View>
        );
    }
}

const styles = {
    tabBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        height: Theme.HOME_INDICATOR_HEIGHT + PxFit(56),
        backgroundColor: '#ffffff',
        borderTopWidth: PxFit(0.5),
        borderTopColor: Theme.borderColor,
    },
    hidden: {
        zIndex: -1,
    },
    lightStyle: {
        backgroundColor: 'transparent',
        borderTopColor: 'transparent',
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
