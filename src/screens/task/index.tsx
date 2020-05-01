import React, { Fragment } from 'react';

import { View, StyleSheet, ImageBackground, Text, Image } from 'react-native';
import { PageContainer, StatusView, Banner, TouchFeedback, Iconfont } from '@src/components';

import TaskBody from './components/TaskBody';
import { app, observer } from 'store';
import { useDetainment } from 'common';

const index = observer(props => {
    const { navigation } = props;
    const { login } = app;

    useDetainment(navigation);
    console.log('Device.WIDTH :', Device.WIDTH);
    return (
        <PageContainer hiddenNavBar>
            <Fragment>
                {login ? (
                    <View style={styles.container}>
                        <TaskBody navigation={navigation} />
                    </View>
                ) : (
                    <StatusView.EmptyView
                        imageSource={require('../../assets/images/default_message.png')}
                        title="登录之后才能查看任务哦"
                    />
                )}
            </Fragment>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    navBarStyle: {
        borderBottomWidth: 0,
        borderBottomColor: '#fff',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingBottom: Device.HOME_INDICATOR_HEIGHT + PxFit(56),
    },
});

export default index;
