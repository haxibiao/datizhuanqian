/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */
'use strict';

import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    Row,
    ListItem,
    CustomSwitch,
    ItemSeparator,
    PopOverlay,
    CustomRefreshControl,
    ListFooter,
    StatusView,
    PullChooser,
} from 'components';
import { Theme, PxFit, Tools, SCREEN_WIDTH, NAVBAR_HEIGHT } from 'utils';
import { app } from 'store';
import { GQL, useQuery } from 'apollo';

import UserProfile from './components/UserProfile';
import QuestionItem from '../profile/components/QuestionItem';

import Placeholder from './components/Placeholder';

const index = (props: Props) => {
    const { navigation } = props;
    const user = navigation.getParam('user', {});
    const [orderByHot, setOrderByHot] = useState(false);
    const [finished, setFinished] = useState(false);

    const ORDER = ['ANSWERS_COUNT', 'CREATED_AT'];

    const { data, error, loading, refetch, fetchMore } = useQuery(GQL.UserInfoQuery, {
        variables: {
            id: user.id,
            order: orderByHot ? ORDER[0] : ORDER[1],
            filter: 'publish',
        },
        fetchPolicy: 'network-only',
    });

    const showOptions = () => {
        let user = navigation.getParam('user', {});

        PullChooser.show([
            {
                title: '举报',
                onPress: () => navigation.navigate('ReportUser', { user }),
            },
        ]);
    };

    const dataUser = Tools.syncGetter('user', data);

    if (!dataUser) {
        return <Placeholder />;
    }

    return (
        <PageContainer
            refetch={refetch}
            error={error}
            title={user.name + '的主页'}
            white
            rightView={
                user.id == app.me.id ? null : (
                    <TouchFeedback onPress={showOptions} style={styles.optionsButton}>
                        <Iconfont name="more-horizontal" color={Theme.defaultTextColor} size={PxFit(18)} />
                    </TouchFeedback>
                )
            }>
            <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
                }}
                style={styles.container}
                data={dataUser.questions}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <UserProfile
                        user={dataUser}
                        hasQuestion={dataUser.questions.length > 0}
                        navigation={navigation}
                        switchOrder={() => setOrderByHot(!orderByHot)}
                        orderByHot={orderByHot}
                    />
                }
                ListEmptyComponent={<StatusView.EmptyView title="空空如也，没有出过题目" />}
                renderItem={({ item, index }) => (
                    <View style={{ paddingHorizontal: PxFit(Theme.itemSpace) }}>
                        <QuestionItem
                            question={item}
                            user={user}
                            questions={dataUser.questions}
                            activeIndex={index}
                            navigation={props.navigation}
                        />
                    </View>
                )}
                refreshControl={<CustomRefreshControl onRefresh={refetch} reset={() => setFinished(false)} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: dataUser.questions.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (
                                !(
                                    fetchMoreResult &&
                                    fetchMoreResult.user &&
                                    fetchMoreResult.user.questions &&
                                    fetchMoreResult.user.questions.length > 0
                                )
                            ) {
                                setFinished(true);
                                return prev;
                            }
                            return Object.assign({}, prev, {
                                user: Object.assign({}, prev.user, {
                                    questions: [...prev.user.questions, ...fetchMoreResult.user.questions],
                                }),
                            });
                        },
                    });
                }}
                ListFooterComponent={() =>
                    dataUser.questions.length == 0 ? <View /> : <ListFooter finished={finished} />
                }
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    optionsButton: {
        flex: 1,
        width: PxFit(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default index;
