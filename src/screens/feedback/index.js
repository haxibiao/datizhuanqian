/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:07
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageContainer, ScrollTabBar, TouchFeedback, Iconfont } from 'components';

import Feedback from './components/Feedback';
import FeedbackList from './components/FeedbackList';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import { config } from 'store';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation } = this.props;
        return (
            <PageContainer hiddenNavBar contentViewStyle={{ marginTop: Device.statusBarHeight }}>
                <ScrollableTabView
                    renderTabBar={props => (
                        <ScrollTabBar
                            {...props}
                            tabUnderlineWidth={PxFit(50)}
                            underLineColor={!config.disableAd ? Theme.primaryColor : '#FFF'}
                        />
                    )}>
                    {!config.disableAd && <FeedbackList navigation={navigation} tabLabel="问题中心" />}
                    <Feedback navigation={navigation} tabLabel="反馈建议" />
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
        width: Device.statusBarHeight,
        height: Device.statusBarHeight,
        minHeight: 44,
        justifyContent: 'center',
        paddingLeft: PxFit(Theme.itemSpace),
    },
});

export default index;
