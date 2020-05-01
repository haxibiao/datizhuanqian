import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { TouchFeedback, PageContainer, Iconfont, CustomTextInput, Row } from 'components';

import MediaSelect from './components/MediaSelect';
import ContributeStore from './ContributeStore';
import { observer, Provider } from 'mobx-react';
import { app, config } from 'store';
import { GQL } from 'apollo';

interface Props {
    navigation: Function;
}

const rewards = [30, 60, 120, 300, 600, 900];
let contributeStore: ContributeStore;

const AskQuestion = observer((props: Props) => {
    const { navigation } = props;
    const [open, setOpen] = useState(false);
    const [reward, setReward] = useState(0);
    const [userGold, setUserGold] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    contributeStore = new ContributeStore();
    contributeStore.setVideoDuration(app.me.video_duration);
    contributeStore.setExplainVideoDuration(app.me.explanation_video_duration);

    const { inputDescription, video_id, description, videoPicke, video_path, category } = contributeStore;

    useEffect(() => {
        app.client
            .query({
                query: GQL.UserMetaQuery,
                variables: {
                    id: app.me.id,
                },
            })
            .then(result => {
                setUserGold(Helper.syncGetter('data.user.gold', result));
            })
            .catch(err => {
                console.log('err', err);
            });
    }, []);

    const cancelReward = () => {
        setOpen(!open);
    };

    const selectReward = (reward: React.SetStateAction<number>) => {
        if (userGold >= reward) {
            setReward(reward);
        } else {
            Toast.show({ content: `智慧点不足，快去赚取吧` });
        }
    };

    const onSubmit = () => {
        if (category && category.id) {
            setSubmitting(true);
            app.mutationClient
                .mutate({
                    mutation: GQL.createQuestionMutation,
                    variables: {
                        data: {
                            description: description,
                            form: open ? 'OPEN' : 'NORMAL',
                            video_id,
                            gold: open ? reward : 0,
                            category_id: category.id,
                        },
                    },
                })
                .then((result: any) => {
                    setSubmitting(false);
                    Toast.show({
                        content: '发布成功',
                    });
                    let questions = [Helper.syncGetter('data.createQuestion', result)];
                    navigation.replace('VideoPost', { questions, index: 0 });
                    // navigation.goBack();
                    contributeStore.removeInstance();
                })
                .catch(err => {
                    console.log('err', err);
                    setSubmitting(false);
                    let str = err.toString().replace(/Error: GraphQL error: /, '');
                    Toast.show({ content: str });
                });
        } else {
            Toast.show({
                content: '请选择专题',
            });
        }
    };

    const disablePublishButton = useMemo(() => {
        return !(description && video_id);
    }, [description, video_id]);

    return (
        <Provider contributeStore={contributeStore}>
            <PageContainer
                white
                submitting={submitting}
                leftView={
                    <TouchFeedback onPress={() => navigation.goBack()} style={{ flex: 1, justifyContent: 'center' }}>
                        <Iconfont name="close" size={22} color={Theme.primaryAuxiliaryColor} />
                    </TouchFeedback>
                }
                rightView={
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <TouchFeedback
                            onPress={onSubmit}
                            disabled={disablePublishButton}
                            style={{
                                borderRadius: PxFit(15),
                                height: PxFit(30),
                                justifyContent: 'center',
                                paddingHorizontal: PxFit(10),
                                backgroundColor: disablePublishButton ? '#F9F9FB' : Theme.primaryColor,
                            }}>
                            <Text style={{ color: disablePublishButton ? Theme.grey : Theme.white }}>立即发布</Text>
                        </TouchFeedback>
                    </View>
                }
                navBarStyle={{
                    borderTopWidth: 0,
                    borderBottomColor: '#fff',
                    backgroundColor: '#fff',
                }}>
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.container}
                        contentContainerStyle={styles.scrollStyle}
                        // ref={ref => (this._scrollView = ref)}>
                    >
                        <View style={styles.question}>
                            <View style={styles.questionBody}>
                                <View style={styles.questionContainer}>
                                    <CustomTextInput
                                        style={styles.questionInput}
                                        value={description}
                                        onChangeText={inputDescription}
                                        multiline
                                        maxLength={100}
                                        textAlignVertical="top"
                                        placeholder="记录你此刻的生活，分享给有趣的人看..."
                                        placeholderTextColor={'#C4BFCF'}
                                    />
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ color: '#C4BFCF', fontSize: PxFit(12) }}>
                                            {description.length}/100
                                        </Text>
                                    </View>
                                    {!!video_path ? (
                                        <MediaSelect />
                                    ) : (
                                        <TouchFeedback
                                            style={styles.mediaPicker}
                                            onPress={() => videoPicke('', 'questions')}
                                            disabled={!!video_path}>
                                            <Image
                                                style={styles.mediaIcon}
                                                source={require('../../assets/images/video_icon.png')}
                                            />
                                        </TouchFeedback>
                                    )}
                                </View>
                            </View>

                            <TouchFeedback onPress={() => navigation.navigate('EditCategory')}>
                                <View style={styles.operationItem}>
                                    <Row>
                                        <Image
                                            style={styles.metaIcon}
                                            source={require('../../assets/images/superb_ic_publish_dubbing.png')}
                                        />
                                        <Text style={styles.itemTypeText}>选择题库</Text>
                                        {category && category.name && (
                                            <Text style={styles.categoryText}>（{category.name}）</Text>
                                        )}
                                    </Row>
                                    <Iconfont name="right" size={PxFit(16)} color={Theme.subTextColor} />
                                </View>
                            </TouchFeedback>
                            {!config.disableAd && (
                                <TouchFeedback onPress={cancelReward}>
                                    <View style={styles.operationItem}>
                                        <Row>
                                            <Image
                                                style={styles.switchButton}
                                                source={require('../../assets/images/reward_icon.png')}
                                            />
                                            <Text style={styles.itemTypeText}>悬赏问答</Text>
                                        </Row>
                                        <TouchFeedback onPress={cancelReward}>
                                            <Image
                                                source={
                                                    open
                                                        ? require('../../assets/images/bg.png')
                                                        : require('../../assets/images/bf.png')
                                                }
                                                style={{ width: 161 / 4, height: 99 / 4 }}
                                            />
                                        </TouchFeedback>
                                    </View>
                                </TouchFeedback>
                            )}
                        </View>
                        {open && (
                            <View style={styles.rewardList}>
                                {rewards.map((gold, index) => {
                                    return (
                                        <TouchFeedback
                                            key={index}
                                            style={[styles.rewardWrap, gold === reward && { borderColor: Theme.theme }]}
                                            onPress={() => selectReward(gold)}>
                                            <Image
                                                source={require('../../assets/images/diamond.png')}
                                                style={{ width: PxFit(18), height: PxFit(18), marginRight: PxFit(5) }}
                                            />
                                            <Text>{gold}</Text>
                                        </TouchFeedback>
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </PageContainer>
        </Provider>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
    questionContainer: {
        paddingVertical: PxFit(10),
        // borderWidth: PxFit(1),
        // borderRadius: PxFit(5),
        // borderColor: Theme.borderColor,
        // alignItems: 'flex-end',
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
        width: PxFit(90),
        height: PxFit(90),
        backgroundColor: '#F9F9FB',
        borderRadius: PxFit(5),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    operationItem: {
        height: PxFit(52),
        paddingRight: PxFit(Theme.itemSpace),
        borderTopWidth: PxFit(0.5),
        borderColor: Theme.borderColor,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mediaIcon: {
        width: PxFit(113) / 4,
        height: PxFit(95) / 4,
        // marginRight: PxFit(15),
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
    switchButton: {
        width: PxFit(20),
        height: PxFit(20),
        marginRight: PxFit(6),
        marginLeft: PxFit(3),
        resizeMode: 'cover',
    },
    rewardList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: PxFit(5),
    },
    rewardWrap: {
        width: (Device.WIDTH - PxFit(40)) / 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: PxFit(15),
        marginHorizontal: PxFit(5),
        borderColor: Theme.lightBorder,
        borderWidth: PxFit(1),
        borderRadius: PxFit(5),
        marginTop: PxFit(10),
    },
});

export default AskQuestion;
