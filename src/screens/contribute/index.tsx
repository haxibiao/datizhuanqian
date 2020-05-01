import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    Row,
    CustomTextInput,
    beginnerGuidance,
    SetQuestionGuidance,
} from 'components';
import { useApolloClient, GQL } from 'apollo';
import { useNavigation } from 'react-navigation-hooks';
import localStore from './ContributeStore';
import Rules from './components/Rules';
import MediaSelect from './components/MediaSelect';
import Options from './components/Options';
import Explain from '../question/components/Explain';
import VideoExplain from '../question/components/VideoExplain';

import { observer, storage, keys, app } from 'store';
import { Provider } from 'mobx-react';
import service from 'service';
import { Overlay } from 'teaset';

export default observer(() => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const store = useRef(new localStore()).current;
    const [submitting, setSubmitting] = useState(false);

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
        store.removeInstance();
        navigation.replace('ContributeSubmited', {
            noTicket: userCache.ticket === 0,
        });
    }, [client]);

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

    const showRules = useCallback(async () => {
        let contributeRuleRead = (await storage.getItem(keys.contributeRuleRead)) || false;
        let overlayRef;
        if (!contributeRuleRead) {
        }
    }, []);

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
        beginnerGuidance({
            guidanceKey: 'InputQuestion',
            GuidanceView: SetQuestionGuidance.inputGuidance,
            skipEnabled: true,
            skipGuidanceKeys: ['InputQuestion', 'SubmitQuestion'],
        });

        showRules();
    }, []);

    const {
        inputDescription,
        category,
        description,
        options,
        optionValue,
        inputOptionValue,
        addOption,
        picture,
        video_path,
        videoPicke,
        imagePicke,
        explain_text,
        explain_picture,
        explain_video,
        explain_video_path,
    } = store;
    const disableAddButton = options.size >= 4 || !optionValue;
    return (
        <Provider contributeStore={store}>
            <PageContainer
                white
                submitting={submitting}
                title="创建题目"
                rightView={
                    <TouchFeedback style={styles.saveButton} onPress={onSubmit}>
                        <Text style={styles.saveText}> 提交 </Text>
                    </TouchFeedback>
                }>
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.container}
                        contentContainerStyle={styles.scrollStyle}>
                        <View style={styles.question}>
                            <View style={styles.questionBody}>
                                <View style={styles.borderItem}>
                                    <Text style={styles.itemTypeText}>题目题干</Text>
                                    <TouchFeedback onPress={() => navigation.navigate('ContributeRule')}>
                                        <Text
                                            style={{
                                                fontSize: PxFit(14),
                                                color: Theme.primaryColor,
                                            }}>
                                            #出题规则
                                        </Text>
                                    </TouchFeedback>
                                </View>
                                <View style={styles.questionContainer}>
                                    <CustomTextInput
                                        style={styles.questionInput}
                                        value={description}
                                        onChangeText={inputDescription}
                                        multiline
                                        maxLength={300}
                                        textAlignVertical="top"
                                        placeholder="填写题干，不少于8个字......"
                                    />
                                    {!!(picture || video_path) && <MediaSelect />}
                                </View>
                                <View style={styles.mediaPicker}>
                                    <Row>
                                        <TouchFeedback
                                            onPress={() => imagePicke()}
                                            disabled={!!(picture || video_path)}>
                                            <Image
                                                style={styles.mediaIcon}
                                                source={require('@src/assets/images/superb_ic_publish_pic.png')}
                                            />
                                        </TouchFeedback>
                                        <TouchFeedback
                                            onPress={() => videoPicke('', 'questions')}
                                            disabled={!!(picture || video_path)}>
                                            <Image
                                                style={styles.mediaIcon}
                                                source={require('@src/assets/images/superb_ic_publish_video.png')}
                                            />
                                        </TouchFeedback>
                                    </Row>
                                </View>
                                <View style={[styles.borderItem, { justifyContent: 'flex-start', marginBottom: 0 }]}>
                                    <Text style={styles.itemTypeText}>答案选项</Text>
                                    <Text style={styles.tips}>(*依次添加答案选项)</Text>
                                </View>
                            </View>
                            <View style={styles.optionInputWrap}>
                                <CustomTextInput
                                    style={styles.optionInput}
                                    value={optionValue}
                                    onChangeText={inputOptionValue}
                                    placeholder="填写答案选项......"
                                    maxLength={100}
                                />
                                {!disableAddButton && (
                                    <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                                        <Text style={styles.addOptionText}> 添 加 </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchFeedback onPress={() => navigation.navigate('EditCategory')}>
                                <View style={styles.operationItem}>
                                    <Row>
                                        <Image
                                            style={styles.metaIcon}
                                            source={require('@src/assets/images/superb_ic_publish_dubbing.png')}
                                        />
                                        <Text style={styles.itemTypeText}>所在题库</Text>
                                        {category && category.name && (
                                            <Text style={styles.categoryText}>（{category.name}）</Text>
                                        )}
                                    </Row>
                                    <Iconfont name="right" size={PxFit(16)} color={Theme.subTextColor} />
                                </View>
                            </TouchFeedback>
                            <TouchFeedback onPress={() => navigation.navigate('EditExplain')}>
                                <View style={styles.operationItem}>
                                    <Row>
                                        <Image
                                            style={styles.metaIcon}
                                            source={require('@src/assets/images/superb_ic_publish_link.png')}
                                        />
                                        <Text style={styles.itemTypeText}>题目解析</Text>
                                    </Row>
                                    <Iconfont name="right" size={PxFit(16)} color={Theme.subTextColor} />
                                </View>
                            </TouchFeedback>
                        </View>
                        <Options />
                        <View style={{ marginHorizontal: PxFit(Theme.itemSpace) }}>
                            <VideoExplain video={explain_video && { ...explain_video, url: explain_video_path }} />
                            <Explain text={explain_text} picture={explain_picture} />
                        </View>
                    </ScrollView>
                </View>
            </PageContainer>
        </Provider>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.groundColour,
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
    scrollStyle: {
        flexGrow: 1,
        paddingBottom: Device.HOME_INDICATOR_HEIGHT + 50,
    },
    question: {
        backgroundColor: '#fff',
        paddingLeft: PxFit(Theme.itemSpace),
    },
    questionBody: {
        marginTop: PxFit(Theme.itemSpace),
        marginRight: PxFit(Theme.itemSpace),
    },
    borderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: PxFit(10),
        paddingLeft: PxFit(6),
        borderLeftWidth: PxFit(3),
        borderLeftColor: Theme.primaryColor,
    },
    tips: {
        marginLeft: PxFit(5),
        fontSize: PxFit(12),
        color: Theme.subTextColor,
    },
    questionContainer: {
        padding: PxFit(10),
        borderWidth: PxFit(1),
        borderRadius: PxFit(5),
        borderColor: Theme.borderColor,
        alignItems: 'flex-end',
    },
    questionInput: {
        alignSelf: 'stretch',
        height: PxFit(100),
        fontSize: PxFit(14),
        lineHeight: PxFit(20),
        backgroundColor: '#fff',
    },
    mediaPicker: {
        marginTop: PxFit(10),
        marginBottom: PxFit(Theme.itemSpace),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    optionInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        height: PxFit(50),
        borderBottomWidth: PxFit(0.5),
        borderColor: Theme.borderColor,
    },
    optionInput: {
        flex: 1,
        alignSelf: 'stretch',
        fontSize: PxFit(14),
        lineHeight: PxFit(20),
    },
    addOptionButton: {
        width: PxFit(52),
        height: PxFit(30),
        marginHorizontal: PxFit(10),
        backgroundColor: Theme.primaryColor,
        borderRadius: PxFit(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    addOptionText: {
        fontSize: PxFit(15),
        color: '#fff',
    },
    operationItem: {
        height: PxFit(52),
        paddingRight: PxFit(Theme.itemSpace),
        borderBottomWidth: PxFit(0.5),
        borderColor: Theme.borderColor,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mediaIcon: {
        width: PxFit(30),
        height: PxFit(30),
        marginRight: PxFit(15),
        resizeMode: 'cover',
    },
    metaIcon: {
        width: PxFit(25),
        height: PxFit(25),
        marginRight: PxFit(5),
        resizeMode: 'cover',
    },
    itemTypeText: {
        fontSize: PxFit(14),
        color: Theme.defaultTextColor,
    },
    categoryText: {
        fontSize: PxFit(14),
        color: Theme.primaryColor,
        marginRight: PxFit(5),
    },
    overlayInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
