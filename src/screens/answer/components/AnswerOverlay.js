/*
 * @flow
 * created by wyk made in 2019-04-20 11:54:52
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { Overlay } from 'teaset';

class AnswerOverlay {
    static Expression(type, bool) {
        let expression = {
            answer: {
                image: bool
                    ? require('@src/assets/images/ic_answered_right.png')
                    : require('@src/assets/images/ic_answered_error.png'),
            },
            audit: {
                image: bool
                    ? require('@src/assets/images/audit_approve.png')
                    : require('@src/assets/images/audit_refused.png'),
            },
        };
        return expression[type] && expression[type].image;
    }

    static Title(type, bool, question) {
        const { wrong_count, count } = question;
        let title = {
            answer: {
                text: bool ? `恭喜你，答对啦！` : '很可惜答错了',
            },
            audit: {
                text: bool ? '已同意' : '已拒绝',
            },
        };
        return title[type] && title[type].text;
    }

    static countdownColose() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.overlayKey && Overlay.hide(this.overlayKey);
        }, 800);
    }

    static show(props) {
        const { gold, ticket, result, type, question } = props;
        let overlayView = (
            <Overlay.View modal onAppearCompleted={() => AnswerOverlay.countdownColose()}>
                <View style={styles.overlay}>
                    <View style={styles.main}>
                        <ImageBackground
                            source={require('@src/assets/images/bg_answered_result.png')}
                            style={{
                                marginTop: PxFit(15),
                                width: Percent(58),
                                height: (Percent(58) * 302) / 553,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image source={AnswerOverlay.Expression(type, result)} style={styles.image} />
                        </ImageBackground>
                        <View style={styles.title}>
                            <Text
                                style={[
                                    styles.titleText,
                                    type == 'answer' && {
                                        color: result ? Theme.weixin : Theme.errorColor,
                                    },
                                ]}>
                                {AnswerOverlay.Title(type, result, question)}
                            </Text>
                            {type == 'audit' && <Text style={styles.resultText}>{`经验值+1    贡献+1`}</Text>}
                            {type == 'answer' && result && (
                                <Text style={styles.resultText}>
                                    {`经验值`}
                                    <Text style={{ color: Theme.primaryColor }}>+1</Text>
                                    {ticket > 0 && `   智慧点`}
                                    <Text style={{ color: Theme.primaryColor }}>+{gold}</Text>
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </Overlay.View>
        );
        this.overlayKey = Overlay.show(overlayView);
    }
}

function correctRate(correct, count) {
    if (typeof correct === 'number' && typeof count === 'number') {
        const result = (correct / count) * 100;
        if (result) {
            return result.toFixed(1) + '%';
        }
        return '暂无统计';
    }
}

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    main: {
        width: Percent(75),
        height: Percent(65),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: PxFit(Theme.itemSpace),
    },
    title: {
        alignItems: 'center',
    },
    titleText: {
        fontSize: Font(16),
        fontWeight: 'bold',
        color: Theme.defaultTextColor,
        marginBottom: PxFit(15),
        lineHeight: PxFit(22),
        textAlign: 'center',
    },
    resultText: {
        fontSize: Font(15),
        color: '#676467',
        marginBottom: PxFit(15),
    },
    image: {
        width: Percent(26),
        height: Percent(26),
    },
});

export default AnswerOverlay;
