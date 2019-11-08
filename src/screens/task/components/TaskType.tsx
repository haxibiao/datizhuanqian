import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Theme, SCREEN_WIDTH, PxFit, Tools } from 'utils';

import { BoxShadow } from 'react-native-shadow';
import TaskItem from './TaskItem';
import { playVideo } from 'common';
import { config } from 'store';

interface Props {
    tasks: Array<object>;
    typeName: String;
    userData: User;
    setLoading: Function;
    setUnLoading: Function;
}

interface Task {
    id: Number;
    name: String;
    gold: Number;
    ticket: Number;
    contribute: Number;
    taskStatus: Number;
    submit_name: string;
    details: string;
    type?: Number;
    route?: String;
}

interface User {
    id: Number;
    name: String;
    level: Level;
}

interface Level {
    id: Number;
    level: Number;
}

const TaskType = (props: Props) => {
    const [taskTypeHeight, setTaskTypeHeight] = useState(70);
    const { typeName, tasks, userData, setLoading, setUnLoading } = props;

    const handler = (task: Task) => {
        //TODO: 后端无业务逻辑的任务需完善task.route
        console.log('userData', userData);
        switch (task.type) {
            case 0:
                Tools.navigate('EditProfile', { user: userData });
                break;
            case 1:
                Tools.navigate('答题');
                break;
            case 2:
                Tools.navigate(task.route, {
                    task: task,
                });
                break;
            // TODO: type 4/5/6 属于前端自定义任务由taskconfig动态配置  需调整为gql
            case 4:
                playVideo({
                    type: 'Task',
                });
                break;
            case 5:
                if (userData.level.level < config.taskConfig.chuti.min_level) {
                    Toast.show({
                        content: `${config.taskConfig.chuti.min_level}级之后才可以出题哦`,
                    });
                } else {
                    Tools.navigate('Contribute');
                }
                break;
            case 6:
                Tools.navigate('Share');
            default:
                Tools.navigate(task.route, {
                    task: task,
                });
                break;
        }
    };

    if (tasks && tasks.length > 0) {
        return (
            <BoxShadow
                setting={Object.assign({}, shadowOpt, {
                    height: taskTypeHeight,
                })}>
                <View
                    style={[styles.container]}
                    onLayout={event => {
                        setTaskTypeHeight(event.nativeEvent.layout.height);
                    }}>
                    <View style={styles.header}>
                        <Text style={styles.text}>{typeName}</Text>
                        <View style={styles.badge} />
                    </View>

                    {tasks.map((task, index) => {
                        // task status == 1 的时候展示任务
                        if (task.status > 0) {
                            return (
                                <TaskItem
                                    key={index}
                                    handler={() => {
                                        console.log(' handler task', task);
                                        handler(task);
                                    }}
                                    task={task}
                                    setLoading={setLoading}
                                    setUnLoading={setUnLoading}
                                />
                            );
                        }
                    })}
                </View>
            </BoxShadow>
        );
    } else {
        return null;
    }
};

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
    },
    badge: {
        backgroundColor: Theme.theme,
        width: 20,
        height: 5,
        marginTop: 10,
    },
    header: {
        marginHorizontal: PxFit(12),
        paddingVertical: PxFit(10),
    },
    text: {
        fontSize: PxFit(18),
        fontWeight: '500',
        color: Theme.black,
    },
});

export default TaskType;