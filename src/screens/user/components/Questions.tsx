import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    CustomRefreshControl,
    ListFooter,
    StatusView,
    PullChooser,
} from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

import { app } from 'store';
import { useQuery, GQL } from 'apollo';

import UserProfile from './UserProfile';
import PostItem from '../../post/components/PostItem';
import Placeholder from './Placeholder';

const ORDER = ['ANSWERS_COUNT', 'CREATED_AT'];
const Questions = props => {
    const { navigation, userInfo } = props;
    const [orderByHot, setOrderByHot] = useState(false);
    const [finished, setFinished] = useState(false);

    const { data, error, loading, refetch, fetchMore } = useQuery(GQL.UserInfoQuery, {
        variables: {
            id: userInfo.id,
            order: orderByHot ? ORDER[0] : ORDER[1],
            filter: 'publish',
        },
        fetchPolicy: 'network-only',
    });

    const showOptions = () => {
        PullChooser.show([
            {
                title: '举报',
                onPress: () => navigation.navigate('ReportUser', { user }),
            },
        ]);
    };

    const switchOrder = () => {
        setOrderByHot(!orderByHot);
    };

    useEffect(() => {}, []);

    if (loading) {
        return <Placeholder />;
    }

    const user = Helper.syncGetter('user', data);
    let questions = user && user.questions ? user.questions : [];

    return (
        <PageContainer
            refetch={refetch}
            error={error}
            hiddenNavBar
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
                data={questions}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <UserProfile
                        user={user}
                        hasQuestion={questions.length > 0}
                        isQuestion={true}
                        navigation={navigation}
                        switchOrder={switchOrder}
                        orderByHot={orderByHot}
                    />
                }
                ListEmptyComponent={<StatusView.EmptyView title="空空如也，没有出过题目" />}
                renderItem={({ item, index }) => (
                    <PostItem
                        post={item}
                        navigation={navigation}
                        isQuestion={true}
                        posts={questions}
                        activeIndex={index}
                        orderByHot={orderByHot ? ORDER[0] : ORDER[1]}
                    />
                )}
                refreshControl={<CustomRefreshControl onRefresh={refetch} reset={() => setFinished(false)} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: questions.length,
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
                ListFooterComponent={() => (questions.length == 0 ? <View /> : <ListFooter finished={finished} />)}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white,
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

export default Questions;
