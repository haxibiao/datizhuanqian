import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { PageContainer, Row, Iconfont, CustomTextInput, Audio } from '@src/components';
import { useApolloClient, GQL } from '@src/apollo';
import { storage, keys, app } from '@src/store';
import service from '@src/service';

import { Overlay } from 'teaset';
import { useNavigation } from 'react-navigation-hooks';
import { observer, useQuestionStore } from './store';
import Selections from './components/Selections';
import BottomTools from './components/BottomTools';
import MediaTool from './components/MediaTool';
import Explain from '../question/components/Explain';
import VideoExplain from '../question/components/VideoExplain';

export default observer(() => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const store = useQuestionStore();
    const [submitting, setSubmitting] = useState(false);
    const {
        description,
        category,
        video,
        audio,
        picture,
        explain,
        setQuestionAudio,
        setDescription,
        setContentPicture,
        setContentVideo,
    } = store;

    const onResponderRelease = useCallback(() => {
        DeviceEventEmitter.emit('hideBottomView');
    }, []);

    const onError = useCallback(error => {
        setSubmitting(false);
        Toast.show({
            content: error,
        });
    }, []);

    const onCompleted = useCallback(() => {
        setSubmitting(false);
        let { userCache } = app;
        client.query({
            query: GQL.UserMetaQuery,
            variables: {
                id: app.me.id,
            },
            fetchPolicy: 'network-only',
        });
        store.resetStore();
        navigation.replace('ContributeSubmited', {
            noTicket: userCache.ticket === 0,
        });
    }, [client]);

    const deleteQuestionAudio = useCallback(() => {
        setQuestionAudio(null);
    }, []);

    const createQuestion = useCallback(
        async explanation_id => {
            let { variables } = store;

            const promiseFn = () => {
                return app.mutationClient.mutate({
                    mutation: GQL.createQuestionMutation,
                    variables: {
                        data: {
                            ...variables,
                            explanation_id,
                        },
                    },
                });
            };

            const [error] = await Helper.exceptionCapture(promiseFn);

            if (error) {
                onError(error.message || '创建失败');
            } else {
                onCompleted();
            }
        },
        [app.mutationClient, onCompleted],
    );

    const createExplanation = useCallback(
        async explanation => {
            const promiseFn = () => {
                return app.mutationClient.mutate({
                    mutation: GQL.createExplanationMutation,
                    variables: explanation,
                });
            };

            const [error, result] = await Helper.exceptionCapture(promiseFn);
            if (error) {
                onError(error.message || '题目解析提交失败');
            } else {
                createQuestion(Helper.syncGetter('data.createExplanation.id', result) || null);
            }
        },
        [app.mutationClient, createQuestion],
    );

    const onSubmit = useCallback(() => {
        if (store.validator(store.variables)) {
            setSubmitting(true);
            let { explanationVariables } = store;
            if (explanationVariables) {
                createExplanation(explanationVariables);
            } else {
                createQuestion();
            }
        }
    }, [createExplanation, createQuestion]);

    useEffect(() => {
        (async () => {
            let contributeRuleRead = await storage.getItem(keys.contributeRuleRead);
            let overlayRef;
            if (!contributeRuleRead) {
            }
        })();
    }, []);

    return (
        <PageContainer
            white
            submitting={submitting}
            title="我的试题"
            rightView={
                <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
                    <Text style={styles.saveText}>提交</Text>
                </TouchableOpacity>
            }>
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.container}
                keyboardDismissMode={Device.IOS ? 'interactive' : 'on-drag'}
                onResponderRelease={onResponderRelease}>
                <TouchableOpacity onPress={() => navigation.navigate('EditCategory')}>
                    <View style={styles.topicItem}>
                        <Row>
                            <Image style={styles.iconTopic} source={require('@src/assets/images/icon_topic.png')} />
                            <Text style={styles.topicText}>{category.name || '选择题库'}</Text>
                        </Row>
                        <Iconfont name="right" size={PxFit(18)} color="#969696" />
                    </View>
                </TouchableOpacity>
                <View style={styles.contentWrap}>
                    <CustomTextInput
                        style={styles.contentInput}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        maxLength={300}
                        textAlignVertical="top"
                        placeholder="输入题干（不少于8个字）"
                    />
                    {!!(picture || video) && (
                        <MediaTool
                            style={{ marginTop: PxFit(15) }}
                            picture={picture}
                            videoPath={video && video.path}
                            setPicture={setContentPicture}
                            setVideo={setContentVideo}
                        />
                    )}
                    {audio && audio.path && (
                        <View style={styles.audioPlayer}>
                            <Audio.Player
                                style={styles.audioContainer}
                                audio={{ ...audio, url: audio.path }}
                                key={audio.key}
                            />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.deleteAudio}
                                onPress={deleteQuestionAudio}>
                                <Iconfont name="trash" color="#5E5E5E" size={PxFit(24)} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={styles.selectionsWrap}>
                    <Selections />
                </View>
                <View style={styles.explainWrap}>
                    <VideoExplain
                        video={
                            Helper.syncGetter('video.path', explain) && {
                                ...explain.video,
                                url: explain.video.path,
                            }
                        }
                    />
                    <Explain
                        text={Helper.syncGetter('text', explain)}
                        picture={Helper.syncGetter('picture', explain)}
                    />
                </View>
            </ScrollView>
            <BottomTools />
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    saveButton: {
        flex: 1,
        justifyContent: 'center',
    },
    saveText: {
        fontSize: PxFit(15),
        textAlign: 'center',
        color: Theme.primaryColor,
    },
    topicItem: {
        flexDirection: 'row',
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(12),
        justifyContent: 'space-between',
        borderBottomWidth: PxFit(1),
        borderBottomColor: '#F1EFFA',
    },
    iconTopic: {
        width: PxFit(22),
        height: PxFit(22),
        marginRight: PxFit(4),
        resizeMode: 'cover',
    },
    topicText: {
        color: '#149EFF',
        fontSize: PxFit(16),
    },
    contentWrap: {
        margin: PxFit(15),
    },
    selectionsWrap: {
        marginLeft: PxFit(15),
    },
    explainWrap: {
        marginHorizontal: PxFit(15),
    },
    contentInput: {
        height: PxFit(120),
        padding: PxFit(10),
        paddingTop: PxFit(10),
        fontSize: PxFit(14),
        lineHeight: PxFit(20),
        borderRadius: PxFit(5),
        backgroundColor: '#f4f4f4',
    },
    audioPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PxFit(15),
    },
    deleteAudio: {
        paddingHorizontal: PxFit(8),
        paddingVertical: PxFit(4),
        marginLeft: PxFit(5),
    },
    audioContainer: {
        width: PxFit(160),
        height: PxFit(36),
        paddingHorizontal: PxFit(14),
        borderRadius: PxFit(18),
    },
});
