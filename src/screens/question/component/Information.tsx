import React, { useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TouchFeedback, Avatar, Iconfont } from '@src/components';
import { Theme, PxFit, Tools, SCREEN_HEIGHT } from '@src/utils';
import { observer } from '@src/screens/answer/store';
import { Overlay } from 'teaset';
import { useNavigation } from 'react-navigation-hooks';
import Explain from './Explain';

export default observer(({ question }) => {
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
                    <ScrollView contentContainerStyle={styles.explainContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.overlayHeader}>
                            <Text style={styles.titleText}>题目解析</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={() => overlayRef.close()}>
                                <Iconfont name="close" size={PxFit(20)} color={'#9E9E9E'} />
                            </TouchableOpacity>
                        </View>
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

    return (
        <View style={styles.information}>
            <View style={styles.infoItemWrap}>
                <View style={styles.infoItem}>
                    <Text style={styles.answerText}>{`正确答案：${question.answer}`}</Text>
                </View>
                {explanation && (
                    <TouchableOpacity activeOpacity={0.8} style={styles.infoItem} onPress={showExplanation}>
                        <Iconfont
                            name="question"
                            size={PxFit(16)}
                            color={'#27AFF8'}
                            style={{ marginRight: PxFit(2), marginTop: PxFit(1) }}
                        />
                        <Text style={styles.explainText}>查看解析</Text>
                    </TouchableOpacity>
                )}
            </View>
            {question.count > 1 && (
                <View style={styles.answerCount}>
                    <Text style={styles.countText}>{`${Tools.NumberFormat(
                        question.count,
                    )}人答过，答对率为${correctRate}`}</Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    information: {
        backgroundColor: '#fff',
        borderRadius: PxFit(5),
        marginBottom: PxFit(20),
        padding: PxFit(15),
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
    answerCount: {
        marginTop: PxFit(20),
    },
    answerText: { fontSize: PxFit(15), color: Theme.defaultTextColor, fontWeight: 'bold' },
    explainText: { fontSize: PxFit(15), color: '#27AFF8' },
    countText: { fontSize: PxFit(14), color: '#525252' },
    explainWrap: {
        height: PxFit(400),
        maxHeight: SCREEN_HEIGHT / 2,
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderTopLeftRadius: PxFit(6),
        borderTopRightRadius: PxFit(6),
    },
    explainContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
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
