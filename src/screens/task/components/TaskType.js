/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 11:02:11
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Theme, SCREEN_WIDTH, PxFit } from '../../../utils';

import { BoxShadow } from 'react-native-shadow';
import TaskItem from './TaskItem';

class TaskType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemHeight: PxFit(70),
            taskTypeHeight: null,
        };
    }

    doTask(task) {
        const { navigation, user, goTask, adinfo, min_level } = this.props;
        if (task.type == 2) {
            navigation.navigate(task.route, {
                task: task,
            });
        } else if (task.type == 1) {
            navigation.navigate('答题');
        } else if (task.type == 3) {
            if (user.level.level < min_level) {
                Toast.show({
                    content: `${min_level}级之后才可以出题哦`,
                });
            } else {
                navigation.navigate('Contribute', { category: {} });
            }
        } else if (task.type == 4) {
            goTask && goTask(task);
        } else if (task.type == 5) {
            navigation.navigate('CpcTask', { adinfo_url: adinfo.cpc_ad_url });
        } else if (task.type == 6) {
            navigation.navigate('Share');
        } else {
            navigation.navigate('EditProfile', { user: user });
        }
    }

    render() {
        const { navigation, tasks, user, name, handlerLoading, goTask, min_level } = this.props;
        let { taskTypeHeight } = this.state;
        return (
            <BoxShadow
                setting={Object.assign({}, shadowOpt, {
                    height: taskTypeHeight,
                })}>
                <View
                    style={[styles.container]}
                    onLayout={event => {
                        this.setState({
                            taskTypeHeight: event.nativeEvent.layout.height,
                        });
                    }}>
                    <View style={styles.header}>
                        <Text style={styles.text}>{name}</Text>
                        <View style={{ backgroundColor: Theme.theme, width: 20, height: 5, marginTop: 10 }} />
                    </View>

                    {tasks.map((task, index) => {
                        //奖励任务(非数据库内的任务)，状态不>1不启用
                        if (!task.id && !task.status) {
                            return null;
                        }
                        return (
                            <TaskItem
                                user={user}
                                key={index}
                                handler={() => {
                                    this.doTask(task);
                                }}
                                type={task.type}
                                navigation={navigation}
                                task={task}
                                goTask={goTask}
                                handlerLoading={handlerLoading}
                                min_level={min_level}
                            />
                        );
                    })}
                </View>
            </BoxShadow>
        );
    }
}

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(30),
    height: PxFit(150),
    color: '#E8E8E8',
    border: PxFit(10),
    radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        marginHorizontal: PxFit(15),
        marginVertical: PxFit(15),
    },
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.white,
        borderRadius: PxFit(10),
        shadowOffset: { width: PxFit(5), height: PxFit(5) },
        shadowColor: '#E8E8E8',
        shadowOpacity: 0.8,
        shadowRadius: PxFit(10),
    },
    header: {
        marginHorizontal: PxFit(15),
        paddingVertical: PxFit(10),
    },
    text: {
        fontSize: PxFit(18),
        fontWeight: '500',
        color: Theme.black,
    },
});

export default TaskType;
