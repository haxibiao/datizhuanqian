/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:02
 */

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';
import { PageContainer, TabBar, EmptyView } from 'components';

import TaskList from './components/TaskList';
import { app, observer } from 'store';
import { ttad } from 'native';

@observer
class index extends Component {
    render() {
        const { navigation } = this.props;
        const { login } = app;

        return (
            <PageContainer isTopNavigator title="任务">
                {login ? (
                    <TaskList navigation={navigation} />
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

const styles = StyleSheet.create({});

export default index;
