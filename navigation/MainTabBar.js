import React from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    Button,
    FlatList
} from "react-native";
import { Divice } from "../constants";

import { Iconfont } from "../utils/Fonts";
import { Colors } from "../constants";

class MainTabBar extends React.Component {
    renderItem = (route, index) => {
        const { navigation, jumpToIndex, renderIcon, getLabel, activeTintColor, inactiveTintColor } = this.props;
        const focused = index === navigation.state.index;
        const color = focused ? activeTintColor : inactiveTintColor;
        const scene = {
            index: index,
            focused: focused,
            route: route,
            tintColor: color
        };
        return (
            <TouchableWithoutFeedback
                key={route.key}
                style={styles.tabItem}
                onPress={() => {
                    jumpToIndex(index);
                }}
            >
                <View style={styles.tabItem}>
                    {renderIcon(scene)}
                    <Text style={{ fontSize: 10, color }}>{getLabel(scene)}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    renderCreation() {
        const { navigation } = this.props;
        return null;
    }

    render() {
        const { navigation } = this.props;
        const { routes } = navigation.state;
        const creationItem = this.renderCreation();
        let routerItem = routes && routes.map((route, index) => this.renderItem(route, index));
        routerItem.splice(2, 0, creationItem);
        return <View style={styles.tab}>{routerItem}</View>;
    }
}

const styles = {
    tab: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        height: 50 + Divice.bottom_height,
        // borderTopWidth: 1,
        // borderTopColor: Colors.tintGray,
        elevation: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: Colors.tintGray,
        shadowOpacity: 1,
        backgroundColor: Colors.white,
        paddingBottom: Divice.bottom_height
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        width: 50,
        position: "relative"
    },
    shot: {
        width: 40,
        height: 40,
        resizeMode: "cover"
    }
};

export default MainTabBar;
