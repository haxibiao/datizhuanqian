/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:07
 */
'use strict';

import React, { Component, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { Theme, SCREEN_WIDTH, PxFit, Tools } from 'utils';

import { TabBarHeader, PageContainer, ScrollTabBar, TouchFeedback, Iconfont, PullChooser } from 'components';

import Questions from './components/Questions';
import Posts from './components/Posts';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useQuery, GQL } from 'apollo';

import QuestionStore from '@src/screens/answer/QuestionStore';

const index = props => {
    const { navigation } = props;
    const user = navigation.getParam('user', {});

    const { data, loading, error } = useQuery(GQL.UserQuery, {
        variables: {
            id: user.id,
        },
        fetchPolicy: 'network-only',
    });

    const showOptions = useCallback(() => {
        PullChooser.show([
            {
                title: '举报',
                onPress: () => navigation.navigate('ReportUser', { user }),
            },
            {
                title: '加入黑名单',
                onPress: () => {
                    setTimeout(() => {
                        Toast.show({ content: '该用户已加入黑名单' });
                    }, 500);
                },
            },
        ]);
    }, []);

    useEffect(() => {
        QuestionStore.recallCache();
    }, []);

    return (
        <PageContainer hiddenNavBar contentViewStyle={{ marginTop: Theme.statusBarHeight }} loading={loading}>
            <ScrollableTabView
                renderTabBar={props => (
                    <ScrollTabBar
                        {...props}
                        tabUnderlineWidth={PxFit(28)}
                        underLineColor={Theme.primaryColor}
                        tabWidth={SCREEN_WIDTH / 4}
                    />
                )}>
                <Questions navigation={navigation} tabLabel="出题" userInfo={Tools.syncGetter('user', data) || user} />
                <Posts navigation={navigation} tabLabel="动态" userInfo={Tools.syncGetter('user', data) || user} />
            </ScrollableTabView>
            <View style={styles.header}>
                <TouchFeedback style={styles.backButton} activeOpacity={1} onPress={() => navigation.goBack()}>
                    <Iconfont name="left" color={Theme.defaultTextColor} size={PxFit(21)} />
                </TouchFeedback>
                <TouchFeedback style={styles.moreButton} activeOpacity={1} onPress={showOptions}>
                    <Iconfont name="more-horizontal" color={Theme.defaultTextColor} size={PxFit(21)} />
                </TouchFeedback>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Theme.navBarContentHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        alignSelf: 'stretch',
        width: Theme.navBarContentHeight,
        justifyContent: 'center',
        paddingLeft: PxFit(Theme.itemSpace),
    },
    moreButton: {
        alignSelf: 'stretch',
        width: Theme.navBarContentHeight,
        justifyContent: 'center',
        paddingRight: PxFit(Theme.itemSpace),
    },
});

export default index;
