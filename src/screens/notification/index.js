/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:48
 */
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { PageContainer, ScrollTab, NavigatorBar, TouchFeedback, Iconfont, Badge } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { observer, app, config } from 'store';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation } from 'react-navigation-hooks';
import Remind from './Remind';
import Chats from './Chats';

export default observer(props => {
    const navigation = useNavigation();

    const renderTabItem = useCallback(({ name, isActive, page }) => {
        const changeTextStyle = isActive ? styles.activeTextStyle : styles.inactivityTextStyle;
        return (
            <View>
                <Text style={changeTextStyle}>{name}</Text>
                {page === 1 && (
                    <View style={styles.badge}>
                        <Badge count={0} />
                    </View>
                )}
            </View>
        );
    }, []);
    return (
        <PageContainer hiddenNavBar contentViewStyle={styles.contentViewStyle} white>
            <ScrollableTabView
                prerenderingSiblingsNumber={Infinity}
                renderTabBar={props => (
                    <ScrollTab
                        {...props}
                        tabWidth={PxFit(80)}
                        underlineWidth={PxFit(16)}
                        underlineStyle={styles.underlineStyle}
                        scrollUnderlineStyle={styles.scrollUnderlineStyle}
                        style={styles.tabBarStyle}
                        renderTabItem={renderTabItem}
                    />
                )}>
                <Remind tabLabel="提醒" navigation={navigation} />
                <Chats tabLabel="私信" navigation={navigation} />
            </ScrollableTabView>
            <View style={styles.backButton}>
                <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                    <Iconfont name="left" color={Theme.defaultTextColor} size={PxFit(21)} />
                </TouchFeedback>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    activeTextStyle: {
        color: Theme.watermelon,
        fontSize: PxFit(17),
    },
    badge: {
        width: PxFit(8),
        height: PxFit(8),
        borderRadius: PxFit(4),
        backgroundColor: Theme.secondaryColor,
        margin: PxFit(4),
    },
    contentViewStyle: { marginTop: Theme.statusBarHeight },
    inactivityTextStyle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
    },
    tabBarStyle: {
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Theme.navBarContentHeight,
        height: Theme.navBarContentHeight,
        justifyContent: 'center',
        paddingLeft: PxFit(Theme.itemSpace),
    },
    underlineStyle: {
        height: PxFit(2),
        backgroundColor: Theme.watermelon,
    },
    scrollUnderlineStyle: {
        left: (SCREEN_WIDTH - PxFit(160)) / 2,
        width: PxFit(160),
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -15,
    },
});
