/* eslint-disable react-native/sort-styles */
/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { TouchFeedback, Button, Row } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS } from 'utils';
import { ttad } from 'native';
import { playVideo } from 'common';

class AnswerResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adShow: false,
        };
    }

    // 加载banner广告dialog
    showBannerAd(answer_result) {
        const { loadRewardVideoAd } = this.props;
        playVideo({
            type: answer_result ? 'AnswerPass' : 'AnswerFail',
            rewardVideoAdCache: loadRewardVideoAd,
        });
    }

    render() {
        const { adShow } = this.state;
        const { hide, answer_count, error_count } = this.props;

        const answer_result = error_count / answer_count <= 0.4;

        return (
            <View style={styles.container}>
                <View>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../../assets/images/money_.png')} style={styles.headerImage} />
                    </View>
                    <View style={styles.wrap}>
                        <Text style={{ fontSize: PxFit(15) }}>{answer_result ? '本轮答题及格' : '本轮答题不及格'}</Text>
                        <Text style={{ paddingVertical: PxFit(5) }}>{`正确${answer_count -
                            error_count}/错误${error_count}`}</Text>
                    </View>
                    {adShow && !ISIOS && (
                        <Row style={{ marginBottom: PxFit(1), justifyContent: 'center' }}>
                            <View style={styles.line} />
                            <Text style={{ color: Theme.theme, fontSize: PxFit(13) }}>{'猜你喜欢'}</Text>
                            <View style={styles.line} />
                        </Row>
                    )}
                    {!ISIOS && (
                        <View>
                            <ttad.FeedAd
                                adWidth={SCREEN_WIDTH - PxFit(48)}
                                onAdShow={() => {
                                    this.setState({
                                        adShow: true,
                                    });
                                }}
                            />
                        </View>
                    )}
                    <View style={{ alignItems: 'center', marginTop: PxFit(5), paddingBottom: 10 }}>
                        <Button
                            style={styles.button}
                            textColor={Theme.white}
                            title={'看视频领奖励'}
                            onPress={() => {
                                this.showBannerAd(answer_result);
                                hide();
                            }}
                        />
                        {answer_result && (
                            <TouchFeedback
                                style={{ paddingTop: 10 }}
                                onPress={() => {
                                    hide();
                                }}>
                                <Text style={{ color: Theme.grey }}>{'继续答题'}</Text>
                            </TouchFeedback>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH - PxFit(48),
        borderRadius: PxFit(6),
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    wrap: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    headerImage: {
        width: 120,
        height: 120,
        marginTop: -60,
    },
    button: {
        backgroundColor: Theme.themeRed,
        borderRadius: PxFit(19),
        height: PxFit(38),
        width: (SCREEN_WIDTH * 5) / 12,
    },
    line: {
        backgroundColor: Theme.theme,
        height: PxFit(0.5),
        width: SCREEN_WIDTH / 4,
    },
});

export default AnswerResult;
