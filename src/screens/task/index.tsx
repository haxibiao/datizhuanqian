import React from 'react';

import { View, StyleSheet } from 'react-native';
import { PageContainer, EmptyView, Banner } from 'components';
import { Theme } from 'utils';

import TaskBody from './components/TaskBody';
import { app, observer } from 'store';
import { useDetainment } from 'common';

const index = observer(props => {
    const { navigation } = props;
    const { login } = app;

    useDetainment(navigation);

    return (
        <PageContainer
            isTopNavigator
            titleStyle={{ color: Theme.defaultTextColor }}
            navBarStyle={styles.navBarStyle}
            backButtonColor={Theme.defaultTextColor}
            // backButtonPress={backPress}
            title="任务">
            {login ? (
                <View style={styles.container}>
                    <Banner />
                    <TaskBody navigation={navigation} />
                </View>
            ) : (
                <EmptyView
                    imageSource={require('../../assets/images/default_message.png')}
                    title="登录之后才能查看任务哦"
                />
            )}
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
        paddingBottom: 50,
    },
});

export default index;
