/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:07
 */
'use strict';

import React, { Component, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { Theme, SCREEN_WIDTH, PxFit, Tools } from 'utils';

import { TabBarHeader, PageContainer, ScrollTabBar, TouchFeedback, Iconfont } from 'components';

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
                <Posts navigation={navigation} tabLabel="动态" userInfo={Tools.syncGetter('user', data) || user} />
                <Questions navigation={navigation} tabLabel="出题" userInfo={Tools.syncGetter('user', data) || user} />
            </ScrollableTabView>
            <View style={styles.backButton}>
                <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                    <Iconfont name="left" color={Theme.defaultTextColor} size={PxFit(21)} />
                </TouchFeedback>
            </View>
        </PageContainer>
    );
};

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

export default index;
