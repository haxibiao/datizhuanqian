import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Iconfont, TouchFeedback, Row } from '@src/components';
import { observer } from '@src/screens/answer/store';
import { Overlay } from 'teaset';
import { useNavigation } from 'react-navigation-hooks';
import Explain from './Explain';

export default observer(({ question, category, showOptions }) => {
    const { explanation } = question;
    const navigation = useNavigation();

    const showExplanation = useCallback(() => {
        let overlayRef;
        const explainContent = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={ref => (overlayRef = ref)}>
                <View style={styles.explainWrap}>
                    <View style={styles.overlayHeader}>
                        <Text style={styles.titleText}>题目解析</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => overlayRef.close()}>
                            <Iconfont name="close" size={PxFit(20)} color={'#9E9E9E'} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.explainContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.overlayContent}>
                            <Explain explanation={explanation} />
                        </View>
                    </ScrollView>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(explainContent);
    }, [explanation, navigation]);

    const correctRate = useMemo(() => {
        if (question.count < 1) {
            return '暂无统计';
        }
        return ((question.correct_count / question.count) * 100).toFixed(1) + '%';
    }, [question]);
    console.log('explanation :', explanation);
    return (
        <View style={styles.information}>
            <View style={styles.infoItemWrap}>
                <View style={styles.infoItem}>
                    <View style={styles.label} />
                    <Text style={styles.answerText}>
                        {`正确答案：`}
                        <Text style={{ color: '#24c374' }}>{question.answer}</Text>
                    </Text>
                </View>
            </View>
            {question.count > 1 && (
                <View style={styles.answerCount}>
                    <Row style={{ justifyContent: 'space-between' }}>
                        <Text style={styles.countText}>{`作答人数：${Helper.count(question.count)}`}</Text>
                        <Row>
                            <Text style={styles.countText}>{`答对率：${correctRate}`}</Text>
                            <TouchFeedback onPress={showOptions}>
                                <Image
                                    source={require('@src/assets/images/ic_answer_share_friend.png')}
                                    style={{
                                        marginLeft: PxFit(10),
                                        height: PxFit(20),
                                        width: (PxFit(20) * 224) / 70,
                                    }}
                                />
                            </TouchFeedback>
                        </Row>
                    </Row>
                    {category.tips && (
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categroyInfoText}>{category.tips}</Text>
                        </View>
                    )}
                </View>
            )}
            {explanation && (
                <TouchFeedback onPress={showExplanation}>
                    <View style={styles.infoItemWrap}>
                        <View style={styles.infoItem}>
                            <View style={styles.label} />
                            <Text style={styles.answerText}>{`本题解析`}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: PxFit(10) }}>
                        <Text style={styles.explainText} numberOfLines={1}>
                            {Helper.syncGetter('content', explanation)}
                        </Text>
                        <Image
                            source={require('@src/assets/images/ic_answer_view_explain.png')}
                            style={{
                                height: PxFit(26),
                                width: (PxFit(26) * 378) / 84,
                                position: 'absolute',
                                right: 0,
                            }}
                        />
                    </View>
                </TouchFeedback>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    information: {
        backgroundColor: '#fff',
        borderRadius: PxFit(5),
        marginBottom: PxFit(20),
        marginTop: PxFit(15),
        // padding: PxFit(15),
    },
    infoItemWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        width: PxFit(3),
        height: PxFit(16),
        backgroundColor: '#FFCB03',
        borderRadius: PxFit(2),
        marginRight: PxFit(10),
    },
    answerCount: {
        // marginTop: PxFit(15),
    },
    answerText: { fontSize: Font(16), color: '#2E3944', fontWeight: 'bold' },
    explainText: {
        fontSize: Font(15),
        color: '#666666',
        lineHeight: Font(26),
    },
    countText: {
        fontSize: Font(15),
        color: '#666666',
        paddingVertical: PxFit(15),
    },
    categoryInfo: {
        height: PxFit(40),
        backgroundColor: '#F6F8FA',
        paddingHorizontal: PxFit(10),
        borderRadius: PxFit(5),
        marginBottom: PxFit(20),
    },
    categroyInfoText: {
        fontSize: Font(14),
        color: '#7D9EC4',
        paddingTop: PxFit(10),
    },
    explainWrap: {
        // height: PxFit(400),
        maxHeight: Device.HEIGHT / 2,
        backgroundColor: '#fff',
        // overflow: 'hidden',
        borderTopLeftRadius: PxFit(6),
        borderTopRightRadius: PxFit(6),
    },
    explainContainer: {
        flexGrow: 1,
        paddingBottom: Device.HOME_INDICATOR_HEIGHT,
    },
    overlayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: PxFit(1),
        borderBottomColor: '#F2F5F7',
    },
    titleText: {
        marginLeft: PxFit(12),
        fontSize: PxFit(16),
        color: '#212121',
    },
    closeButton: {
        padding: PxFit(12),
        alignSelf: 'stretch',
    },
    overlayContent: {
        flex: 1,
    },
});
