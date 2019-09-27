/* eslint-disable react-native/sort-styles */
/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, Image, Platform, View, Text } from 'react-native';
import { TouchFeedback, Button, Row, RewardTipsOverlay } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools, ISIOS } from 'utils';
import { ttad } from 'native';
import { GQL } from 'apollo';

import { app } from 'store';

class AnswerResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adShow: false,
        };
    }

    // 加载banner广告dialog
    showBannerAd(click, answer_result) {
        console.log('click', click);
        switch (click) {
            case 'LoadRewardVideo':
                // 加载激励视频
                this.loadRewardVideo(answer_result);
                break;

            case 'LoadFullScreenVideo':
                // 加载全屏视频
                this.loadFullScreenVideo();
                break;
        }
    }

    loadFullScreenVideo = () => {
        const { loadFullVideoAd, data } = this.props;
        const adinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.appid', data),
            tt_codeid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.codeid', data),
        };

        if (loadFullVideoAd) {
            this.startFullScreenVideoAd(adinfo);
        } else {
            ttad.FullScreenVideo.loadFullScreenVideoAd(adinfo).then(() => {
                this.startFullScreenVideoAd(adinfo);
            });
        }
    };

    // 展示全屏视频
    startFullScreenVideoAd = adinfo => {
        const { client } = this.props;
        console.log('adinfo', adinfo);
        ttad.FullScreenVideo.startFullScreenVideoAd(adinfo)
            .then(result => {
                if (result) {
                    client
                        .mutate({
                            mutation: GQL.UserRewardMutation,
                            variables: {
                                reward: 'FULL_SCREEN_VIDEO_REWARD',
                            },
                            errorPolicy: 'all',
                            refetchQueries: () => [
                                {
                                    query: GQL.UserMetaQuery,
                                    variables: { id: app.me.id },
                                    fetchPolicy: 'network-only',
                                },
                            ],
                        })

                        .then(res => {
                            this.loadRewardTips(res);
                        })
                        .catch(err => {
                            console.log('full screen video result error', err);
                            Toast.show({
                                content: '发生未知错误、领取失败',
                            });
                        });
                }
            })
            .catch(err => {
                console.log('full screen video error', err);
                Toast.show({
                    content: '发生未知错误、领取失败',
                });
            });
    };

    // 加载激励视频
    loadRewardVideo = answer_result => {
        const { data, loadRewardVideoAd } = this.props;
        const adinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.tt_appid', data),
            tt_codeid: Tools.syncGetter('user.adinfo.tt_codeid', data),
            uid: data.user.id,
        };

        if (loadRewardVideoAd) {
            this.startRewardVideo(adinfo);
        } else {
            ttad.RewardVideo.loadAd(adinfo).then(() => {
                this.startRewardVideo(adinfo, answer_result);
            });
        }
    };

    // 展示激励视频
    startRewardVideo = (adinfo, answer_result) => {
        const { client } = this.props;
        ttad.RewardVideo.startAd(adinfo).then(result => {
            if (result) {
                // 发放奖励 banner弹窗
                client
                    .mutate({
                        mutation: GQL.UserRewardMutation,
                        variables: {
                            reward: answer_result ? 'SUCCESS_ANSWER_VIDEO_REWARD' : 'FAIL_ANSWER_VIDEO_REWARD',
                        },
                        errorPolicy: 'all',
                        refetchQueries: () => [
                            {
                                query: GQL.UserMetaQuery,
                                variables: { id: app.me.id },
                                fetchPolicy: 'network-only',
                            },
                        ],
                    })
                    .then(res => {
                        this.loadRewardTips(res);
                    })
                    .catch(err => {
                        console.log('reward video error', err);
                        Toast.show({
                            content: '发生未知错误、领取失败',
                        });
                    });
            }
        });
    };

    // 加载奖励结果提示

    loadRewardTips(res) {
        const { navigation } = this.props;
        RewardTipsOverlay.show(res.data.userReward, navigation);
    }

    loadRewardDialog(res) {
        const { data, navigation } = this.props;
        const rewardDialogAdinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.bannerAd.appid', data),
            tt_codeid: Tools.syncGetter('user.adinfo.bannerAd.codeid', data),
        };
    }

    render() {
        const { adShow } = this.state;
        const { navigation, hide, answer_count, error_count } = this.props;

        const answer_result = error_count / answer_count <= 0.4;

        return (
            <View style={styles.container}>
                <View>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../../assets/images/money_.png')} style={styles.headerImage} />
                    </View>
                    <View style={styles.wrap}>
                        <Text style={{ fontSize: PxFit(15) }}>{answer_result ? '本轮答题及格' : '本轮答题不及格'}</Text>
                        <Text style={{ paddingVertical: PxFit(8) }}>{`正确${answer_count -
                            error_count}/错误${error_count}`}</Text>
                    </View>
                    {adShow && !ISIOS && (
                        <Row style={{ marginBottom: PxFit(10) }}>
                            <View style={styles.line} />
                            <Text style={{ color: Theme.theme, fontSize: PxFit(13) }}>{'猜你喜欢'}</Text>
                            <View style={styles.line} />
                        </Row>
                    )}
                    {!ISIOS && (
                        <View>
                            <ttad.BannerAd
                                adWidth={SCREEN_WIDTH - PxFit(120)}
                                onLoad={e => {
                                    this.setState({ adShow: true });
                                }}
                            />
                        </View>
                    )}
                    <View style={{ alignItems: 'center', marginTop: PxFit(15) }}>
                        <Button
                            style={styles.button}
                            textColor={Theme.white}
                            title={'看视频领奖励'}
                            onPress={() => {
                                this.showBannerAd('LoadRewardVideo', answer_result);
                                hide();
                            }}
                        />
                        <TouchFeedback
                            style={{ paddingVertical: 10 }}
                            onPress={() => {
                                answer_result ? null : this.showBannerAd('LoadFullScreenVideo', answer_result);
                                hide();
                            }}>
                            <Text style={{ color: Theme.grey }}>{answer_result ? '继续答题' : '领安慰奖励'}</Text>
                        </TouchFeedback>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH - PxFit(90),
        borderRadius: PxFit(15),
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
