import React, { Component, useState } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import {
    PageContainer,
    Row,
    Avatar,
    UserTitle,
    GenderLabel,
    Like,
    TouchFeedback,
    CustomRefreshControl,
    ListFooter,
    PlaceholderImage,
} from 'components';

import { compose, useQuery, graphql, GQL } from '@src/apollo';
import { app } from '@src/store';

import ImageItem from '@src/screens/post/components/ImageItem';

const MyLikes = props => {
    const { navigation } = props;
    const { data, error, loading, refetch, fetchMore } = useQuery(GQL.LikesQuery, {
        variables: {
            user_id: app.me.id,
        },
        client: app.snsClient,
        fetchPolicy: 'network-only',
    });

    const [finished, setfinished] = useState(false);
    const paginatorInfo = Helper.syncGetter('likes.paginatorInfo', data);
    const likesData = Helper.syncGetter('likes.data', data) || [];
    const likes = likesData.filter(elem => {
        return elem.question || elem.post;
    });
    console.log('paginatorInfo :>> ', paginatorInfo, data);
    return (
        <PageContainer
            title="我的点赞"
            refetch={refetch}
            loading={loading}
            error={error}
            empty={likes.length < 1}
            white>
            <FlatList
                contentContainerStyle={styles.container}
                data={likes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <QuestionItem like={item} navigation={navigation} />}
                refreshControl={<CustomRefreshControl onRefresh={refetch} reset={() => setfinished(false)} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            page: ++paginatorInfo.currentPage,
                        },
                        updateQuery: (prev: { likes: { data: any } }, { fetchMoreResult: more }: any) => {
                            return {
                                likes: {
                                    ...more.likes,
                                    data: [...prev.likes.data, ...more.likes.data],
                                },
                            };
                        },
                    });
                }}
                ListFooterComponent={() => <ListFooter finished={finished} />}
            />
        </PageContainer>
    );
};

export const QuestionItem = props => {
    const {
        navigation,
        like: { question, created_at, post },
        like,
    } = props;
    // const { id, category, image, description, video, count, user } = question;
    const user = Helper.syncGetter('user', question) || Helper.syncGetter('user', post);
    const description = Helper.syncGetter('description', question) || Helper.syncGetter('content', post);
    const video = Helper.syncGetter('video', question) || Helper.syncGetter('video', post);
    const image = Helper.syncGetter('image', question) || Helper.syncGetter('image', post);
    const count_comments = Helper.syncGetter('count_comments', question) || Helper.syncGetter('count_comments', post);

    const navigationAction = () => {
        question
            ? navigation.navigate('Question', { question })
            : navigation.navigate('VideoPost', { medium: [post], isPost: true });
    };

    return (
        <TouchFeedback style={styles.itemContainer} onPress={navigationAction}>
            <Row style={{ justifyContent: 'space-between' }}>
                <TouchFeedback onPress={() => navigation.navigate('User', { user })}>
                    <Row>
                        <Avatar source={{ uri: user.avatar }} size={PxFit(36)} userId={Helper.syncGetter('id', user)} />
                        <View style={{ marginLeft: PxFit(8) }}>
                            <Text style={styles.userName}>{user.name}</Text>
                            {/* <Row>
                                <GenderLabel user={user} size={PxFit(8)} />
                                <UserTitle user={user} />
                            </Row> */}
                        </View>
                    </Row>
                </TouchFeedback>
                {question && (
                    <View style={styles.rightTextWrap}>
                        <Text style={{ fontSize: 12, color: '#C5C5C5' }}>
                            {Helper.count(Helper.syncGetter('count', question))}人答过
                        </Text>
                    </View>
                )}
            </Row>
            <View style={{ paddingVertical: PxFit(10) }}>
                <Text
                    style={{
                        color: '#333333',
                        paddingVertical: PxFit(10),
                        fontSize: Font(14),
                        lineHeight: PxFit(22),
                    }}>
                    {description}
                    {question && (
                        <Text
                            onPress={() =>
                                navigation.navigate('Answer', {
                                    category: Helper.syncGetter('category', question),
                                    question_id: null,
                                })
                            }
                            style={{ color: '#7094BD' }}>
                            {` #`}
                            {Helper.syncGetter('category.name', question)}
                        </Text>
                    )}
                </Text>
                <ImageItem media={video ? video : image} />
            </View>
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(10) }}>
                <Text style={styles.timeText}>{created_at}</Text>
                <Row>
                    <Like
                        media={{ liked: true, ...(question || post) }}
                        type="icon"
                        iconSize={Font(18)}
                        containerStyle={styles.likeContainer}
                        textStyle={styles.likeTextStyle}
                        isQuestion={question ? true : false}
                    />
                    <TouchFeedback style={styles.row}>
                        <Image source={require('@src/assets/images/comment_icon.png')} style={styles.commentIcon} />
                        <Text style={styles.commentText}>{count_comments || '评论'}</Text>
                    </TouchFeedback>
                </Row>
            </Row>
        </TouchFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // padding: PxFit(Theme.itemSpace),
        backgroundColor: '#fff',
    },
    itemContainer: {
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
        paddingVertical: PxFit(15),
        paddingHorizontal: PxFit(17),
    },
    userName: {
        // marginBottom: PxFit(5),
        color: '#424242',
        fontSize: Font(14),
    },
    rightTextWrap: {
        paddingHorizontal: PxFit(17),
        paddingVertical: PxFit(5),
        backgroundColor: '#F9F9FB',
        borderRadius: PxFit(20),
    },
    timeText: {
        color: '#CCD5E0',
        fontSize: Font(13),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentIcon: {
        width: Font(16),
        height: Font(16),
    },
    commentText: {
        paddingLeft: PxFit(5),
        color: '#CCD5E0',
        fontSize: Font(13),
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PxFit(20),
    },
    likeTextStyle: {
        color: '#CCD5E0',
        fontSize: Font(13),
        marginStart: PxFit(5),
        marginEnd: PxFit(23),
    },
});

export default MyLikes;
