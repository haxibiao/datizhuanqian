/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:07
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { Theme, SCREEN_WIDTH, PxFit } from 'utils';

import { TabBarHeader, PageContainer, ScrollTabBar, TouchFeedback, Iconfont } from 'components';

import Contributes from '../contribute/Contributes';
import SpiderList from './components/SpiderList';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class MyPublish extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation } = this.props;
        const initialPage = navigation.getParam('initialPage', 0);
        return (
            <PageContainer hiddenNavBar contentViewStyle={{ marginTop: Theme.statusBarHeight }}>
                <ScrollableTabView
                    renderTabBar={props => (
                        <ScrollTabBar
                            {...props}
                            tabUnderlineWidth={PxFit(28)}
                            underLineColor={Theme.primaryColor}
                            tabWidth={SCREEN_WIDTH / 4}
                        />
                    )}
                    initialPage={initialPage ? initialPage : 0}>
                    <SpiderList navigation={navigation} tabLabel='动态' />
                    <Contributes navigation={navigation} tabLabel='出题' />
                </ScrollableTabView>
                <View style={styles.backButton}>
                    <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                        <Iconfont name='left' color={Theme.defaultTextColor} size={PxFit(21)} />
                    </TouchFeedback>
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Theme.navBarContentHeight,
        height: Theme.navBarContentHeight,
        justifyContent: 'center',
        paddingLeft: PxFit(Theme.itemSpace),
    },
});

export default MyPublish;
