import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, Platform } from 'react-native';

import { SubmitLoading, Banner, TouchFeedback, RewardTipsOverlay, TipsOverlay } from 'components';
import { Theme, SCREEN_WIDTH, Config, Tools, ISIOS, PxFit, ISAndroid } from 'utils';
import { Query, Mutation, graphql, withApollo, compose, GQL, useQuery } from 'apollo';
import { observer, app, config, keys, storage } from 'store';

import { ttad } from 'native';
import { playVideo } from 'common';
import service from 'service';

import AttendanceBook from './AttendanceBook';
import TaskType from './TaskType';

const TaskBody = () => {
    const [userTasks, setUserTasks] = useState();

    const TasksQuery = useQuery(GQL.TasksQuery, {
        variables: { offest: 0, limit: 20 },
    });

    useEffect(() => {
        const {
            data: { tasks },
            loading,
        } = TasksQuery;
        if (!loading && tasks.length > 0) {
            // 新人任务
            const newUserTask = tasks.filter((elem, i) => {
                return elem.type == 0;
            });
            // 每日任务
            const dailyTask = tasks.filter((elem, i) => {
                return elem.type == 1;
            });
            //成长任务
            const growUpTask = tasks.filter((elem, i) => {
                return elem.type == 2;
            });
            const arry = [
                {
                    typeName: '激励任务',
                    tasks: [
                        // {
                        //     name: '看视频赚钱',
                        //     status: rewardStatus,
                        //     taskStatus: rewardTaskAction,
                        //     gold: rewardGold,
                        //     ticket: rewardTicket,
                        //     contribute: rewardContribute,
                        //     type: 4,
                        // },
                        // {
                        //     name: '出题赚钱',
                        //     status: 1,
                        //     taskStatus: 4,
                        //     gold,
                        //     ticket,
                        //     contribute,
                        //     type: 3,
                        // },
                        // {
                        //     name: '分享领现金',
                        //     status: invitationStatus,
                        //     taskStatus: 7,
                        //     gold: invitationGold,
                        //     contribute: invitationContribute,
                        //     type: 6,
                        // },
                    ],
                    doTask: null,
                },
                {
                    typeName: '新人任务',
                    tasks: newUserTask,
                    doTask: null,
                },
                {
                    typeName: '每日任务',
                    tasks: dailyTask,
                    doTask: null,
                },
                {
                    typeName: '成长任务',
                    tasks: growUpTask,
                    doTask: null,
                },
            ];
            setUserTasks(arry);
        }
    }, [TasksQuery.loading]);

    const doTask = () => {};

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <AttendanceBook />
            {userTasks &&
                userTasks.map((data: any, index: any) => {
                    return (
                        <TaskType
                            tasks={data.tasks}
                            typeName={data.typeName}
                            key={index}
                            doTask={task => {
                                const reward = {
                                    gold: task.gold,
                                    ticket: task.ticket,
                                    contribute: task.contribute,
                                };
                                playVideo({
                                    reward,
                                    rewardVideoAdCache: rewardVideoAdCache,
                                    callback: setRewardStatus,
                                    refresh: refetchUserQuery,
                                    type: 'Task',
                                });
                            }}
                        />
                    );
                })}

            <SubmitLoading isVisible={false} content={'领取中'} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: PxFit(50),
    },
});

export default TaskBody;
