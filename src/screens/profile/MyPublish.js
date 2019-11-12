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
import AskQuestionList from './components/AskQuestionList';

import ScrollableTabView from 'react-native-scrollable-tab-view';

class MyPublish extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation } = this.props;
        return (
            <PageContainer hiddenNavBar contentViewStyle={{ marginTop: Theme.statusBarHeight }}>
                <ScrollableTabView
                    renderTabBar={props => (
                        <ScrollTabBar {...props} tabUnderlineWidth={PxFit(25)} underLineColor={Theme.primaryColor} />
                    )}>
                    <AskQuestionList navigation={navigation} tabLabel="视频" />
                    <Contributes navigation={navigation} tabLabel="出题" />
                </ScrollableTabView>
                <View style={styles.backButton}>
                    <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                        <Iconfont name="left" color={Theme.defaultTextColor} size={PxFit(21)} />
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
