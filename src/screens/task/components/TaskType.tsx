import React, { useState } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import { Theme, SCREEN_WIDTH, PxFit, ISIOS } from 'utils';

import TaskItem from './TaskItem';
import { playVideo } from 'common';
import { config, app, observer } from 'store';
import { NavigationActions } from 'react-navigation';

interface Props {
    tasks: Array<object>;
    typeName: String;
    userData: User;
    setLoading: Function;
    setUnLoading: Function;
    navigation: any;
}

interface Task {
    id: Number;
    name: String;
    gold: Number;
    ticket: Number;
    contribute: Number;
    userTaskStatus: Number;
    submit_name: string;
    details: string;
    type?: Number;
    route?: string;
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

const TaskType = observer((props: Props) => {
    const [, setTaskTypeHeight] = useState(70);
    const { typeName, tasks, userData, setLoading, setUnLoading, navigation } = props;

    const handler = (task: Task) => {
        //TODO: 后端无业务逻辑的任务需完善task.route
        console.log('userData', userData);
        switch (task.type) {
            case 0:
                Helper.middlewareNavigate('EditProfile', { user: userData });
                break;
            case 1:
                const resetAction = NavigationActions.navigate({
                    routeName: task.route || '答题',
                });
                navigation.dispatch(resetAction);

                // Helper.middlewareNavigate(task.route);
                // Helper.middlewareNavigate('答题');
                //实际需求写法
                // Helper.middlewareNavigate(task.route,{...task.params});
                break;
            case 2:
                Helper.middlewareNavigate(task.route, {
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
                    Helper.middlewareNavigate('Contribute');
                }
                break;
            case 6:
                Helper.middlewareNavigate('Share');
            case 7:
                if (app.firstReadSpiderVideoTask) {
                    Linking.openURL(ISIOS ? 'itms-apps://itunes.apple.com/app/id1142110895' : 'snssdk1128://');
                } else {
                    Helper.middlewareNavigate('SpiderVideoTask');
                    app.setReadSpiderVideoTask(true);
                }
            //TODO： 唤起抖音   scheme可能存在一旦更改无法唤起的风险
            default:
                Helper.middlewareNavigate(task.route, {
                    task: task,
                });
                break;
        }
    };

    if (tasks && tasks.length > 0) {
        return (
            <View
                style={[styles.container]}
                onLayout={event => {
                    setTaskTypeHeight(event.nativeEvent.layout.height);
                }}>
                <View style={styles.header}>
                    <Text style={styles.text}>{typeName}</Text>
                </View>
                {tasks.map((task, index) => {
                    // task status == 1 的时候展示任务
                    if (task.status > 0 || task.status == null) {
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
        );
    } else {
        return null;
    }
});

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
