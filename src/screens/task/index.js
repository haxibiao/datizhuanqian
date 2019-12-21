/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:02
 */

import React, { Component, Fragment } from 'react';

import { StyleSheet, View } from 'react-native';
import { PageContainer, TabBar, EmptyView, Banner } from 'components';
import { Theme } from 'utils';

import TaskBody from './components/TaskBody';
import { app, observer } from 'store';
import { ad } from 'native';

@observer
class index extends Component {
    render() {
        const { navigation } = this.props;
        const { login } = app;

        return (
            <PageContainer
                isTopNavigator
                titleStyle={{ color: Theme.defaultTextColor }}
                navBarStyle={styles.navBarStyle}
                backButtonColor={Theme.defaultTextColor}
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
    }
}

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
