import React from 'react';
import { StyleSheet, View } from 'react-native';

import { PageContainer, ScrollTabBar, TouchFeedback, Iconfont } from 'components';

import AllAnswerLog from './components/AllAnswerLog';
import AnswerFailLog from './components/AnswerFailLog';

import ScrollableTabView from 'react-native-scrollable-tab-view';

const AnswerLog = (props: { navigation: any }) => {
    const { navigation } = props;
    return (
        <PageContainer hiddenNavBar contentViewStyle={{ marginTop: Device.statusBarHeight }}>
            <ScrollableTabView
                renderTabBar={props => (
                    <ScrollTabBar
                        {...props}
                        tabUnderlineWidth={PxFit(28)}
                        underLineColor={Theme.primaryColor}
                        tabWidth={Device.WIDTH / 4}
                    />
                )}
                initialPage={0}>
                <AllAnswerLog navigation={navigation} tabLabel="所有记录" />
                <AnswerFailLog navigation={navigation} tabLabel="错题记录" />
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
        width: Device.statusBarHeight,
        height: Device.statusBarHeight,
        justifyContent: 'center',
        paddingLeft: PxFit(Theme.itemSpace),
        minHeight: 44,
    },
});

export default AnswerLog;
