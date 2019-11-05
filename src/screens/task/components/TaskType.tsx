import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Theme, SCREEN_WIDTH, PxFit, Tools } from 'utils';

import { BoxShadow } from 'react-native-shadow';
import TaskItem from './TaskItem';

interface Props {
    tasks: Array<object>;
    typeName: String;
    doTask: Function;
}

interface Task {
    type?: Number;
    route?: String;
}

const TaskType = (props: Props) => {
    const [taskTypeHeight, setTaskTypeHeight] = useState(70);
    const { typeName, tasks, doTask } = props;

    const handler = (task: Task) => {
        if (task.route) {
            Tools.navigate(task.route, {
                task: task,
            });
        }
        //TODO: 后端无业务逻辑的任务需完善task.route
        switch (task.type) {
            case 1:
                Tools.navigate('答题');
                break;
            case 2:
                Tools.navigate(task.route, {
                    task: task,
                });
                break;
            default:
                doTask && doTask();
                break;
        }

        // else if (task.type == 3) {
        //     if (user.level.level < 2) {
        //         Toast.show({
        //             content: `2级之后才可以出题哦`,
        //         });
        //     } else {
        //         Tools.navigate('Contribute', { category: {} });
        //     }
        // } else if (task.type == 4) {
        //     // goTask && goTask(task);
        // } else if (task.type == 5) {
        //     Tools.navigate('CpcTask');
        // } else if (task.type == 6) {
        //     Tools.navigate('Share');
        // } else {
        //     Tools.navigate('EditProfile', { user: user });
        // }
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
                        return (
                            <TaskItem
                                key={index}
                                handler={() => {
                                    handler(task);
                                }}
                                task={task}
                            />
                        );
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
