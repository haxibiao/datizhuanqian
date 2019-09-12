/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Image } from 'react-native';
import { Iconfont, Row, PlaceholderImage } from '../../../components';
import { Theme, PxFit, Tools } from '../../../utils';
import Video from 'react-native-video';

class QuestionItem extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        question: {},
    };

    submitStatus(submit) {
        switch (String(submit)) {
            case '-3':
                this.Submit = { text: '草稿箱', color: Theme.subTextColor, remarkType: '状态' };
                break;
            case '-2':
                this.Submit = { text: '已拒绝', color: Theme.errorColor, remarkType: '原因' };
                break;
            case '-1':
                this.Submit = { text: '被下架', color: Theme.errorColor, remarkType: '原因' };
                break;
            case '1':
                this.Submit = { text: '已入库', color: Theme.correctColor, remarkType: '状态' };
                break;
            case '0':
                this.Submit = { text: '审核中', color: Theme.subTextColor, remarkType: '状态' };
                break;
            default:
                this.Submit = { text: '审核中', color: Theme.subTextColor, remarkType: '状态' };
        }
    }

    renderVideo = () => {
        const {
            question: { description, image, video, answer },
        } = this.props;
        console.log('video', video);
        if (video) {
            return (
                <View style={[styles.image, { backgroundColor: '#201e33' }]}>
                    <Image source={{ uri: video.cover }} style={{ width: PxFit(60), height: PxFit(60) }} />
                    <Iconfont name="paused" size={PxFit(24)} color="#fff" style={styles.fullScreen} />
                </View>
            );
        } else {
            return null;
        }
    };

    render() {
        let { question, navigation } = this.props;
        let {
            category,
            image,
            description,
            created_at,
            count,
            submit,
            status,
            remark,
            video,
            accepted_count,
            declined_count,
        } = question;

        this.submitStatus(submit);
        return (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Question', { question })}>
                <View style={styles.questionItem}>
                    <View style={styles.questionStatus}>
                        <Row style={{ flex: 1 }}>
                            <Text style={{ fontSize: PxFit(14), color: this.Submit.color }}>{this.Submit.text}</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: PxFit(10) }}>
                                <Text style={styles.metaText}>{created_at}</Text>
                            </View>
                        </Row>
                        {remark && (
                            <Text style={[styles.remark, { color: this.Submit.color }]} numberOfLines={1}>
                                {this.Submit.remarkType + ':' + remark}
                            </Text>
                        )}
                    </View>
                    <View style={{ padding: PxFit(Theme.itemSpace) }}>
                        <View style={styles.questionContent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.subjectText} numberOfLines={3}>
                                    {description}
                                </Text>
                            </View>
                            {image && <PlaceholderImage source={{ uri: image.path }} style={styles.image} />}
                            {this.renderVideo()}
                        </View>
                        <View style={styles.meta}>
                            <Text style={styles.categoryText} numberOfLines={1}>
                                #{category.name}
                            </Text>
                            {status === 0 && (
                                <Text style={styles.metaText}>
                                    {accepted_count}赞同 / {declined_count}反对
                                </Text>
                            )}
                            {status === 1 && (
                                <Text style={styles.metaText}>
                                    {Tools.NumberFormat(count) +
                                        '人答过/正确率' +
                                        correctRate(question.correct_count, question.count)}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

function correctRate(correct, count) {
    if (typeof correct === 'number' && typeof count === 'number') {
        let result = (correct / count) * 100;
        if (result) {
            return result.toFixed(1) + '%';
        }
        return '暂无统计';
    }
}

const styles = StyleSheet.create({
    questionItem: {
        marginBottom: PxFit(Theme.itemSpace),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
    },
    questionStatus: {
        paddingVertical: PxFit(10),
        paddingHorizontal: PxFit(Theme.itemSpace),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: '#f0f0f0',
    },
    remark: { fontSize: PxFit(13), color: Theme.errorColor, marginTop: PxFit(5) },
    questionContent: { flexDirection: 'row', alignItems: 'center', marginBottom: PxFit(Theme.itemSpace) },
    categoryText: {
        fontSize: PxFit(14),
        color: Theme.primaryColor,
        borderColor: Theme.primaryColor,
    },
    subjectText: {
        fontSize: PxFit(15),
        lineHeight: PxFit(20),
        color: Theme.primaryFont,
    },
    image: {
        width: PxFit(60),
        height: PxFit(60),
        borderRadius: PxFit(5),
        resizeMode: 'cover',
        marginLeft: PxFit(12),
        overflow: 'hidden',
    },
    fullScreen: {
        position: 'absolute',
        top: PxFit(18),
        left: PxFit(18),
        bottom: 0,
        right: 0,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaText: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
});

export default QuestionItem;
