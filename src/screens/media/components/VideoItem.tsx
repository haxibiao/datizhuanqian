import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PxFit, Theme, ISIOS } from 'utils';
import { ad } from 'native';

import { observer, app, config } from 'store';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';
import { GQL, useMutation } from 'apollo';
import { exceptionCapture } from 'common';
import { Row } from 'components';
import AdRewardProgress from './AdRewardProgress';

import service from 'service';

export default observer(props => {
    const { media, index, isPost } = props;
    const { video, title, user, description } = media;
    const [adShow, setAdShow] = useState(true);
    const isAdMedia = useMemo(() => media.is_ad && adShow && !ISIOS && config.enableDrawFeed, [media]);

    const [onClickReward] = useMutation(GQL.UserRewardMutation, {
        variables: {
            reward: 'DRAW_FEED_ADVIDEO_REWARD',
        },
        refetchQueries: () => [
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
            },
        ],
    });

    const getReward = async (media: any) => {
        const drawFeedAdId = media.id.toString();

        if (VideoStore.getReward.indexOf(drawFeedAdId) === -1) {
            VideoStore.addGetRewardId(drawFeedAdId);
            // 发放给精力奖励
            const [error, res] = await exceptionCapture(onClickReward);
            if (error) {
                Toast.show({
                    content: '遇到未知错误，领取失败',
                });
            } else {
                const contribute = Helper.syncGetter('data.userReward.contribute', res);
                Toast.show({
                    content: `恭喜你获得+${contribute}贡献值`,
                    duration: 2000,
                });
            }

            service.dataReport({
                data: { category: '广告点击', action: 'user_click_drawfeed_ad', name: '用户点击drawFeed广告' },
                callback: (result: any) => {
                    console.warn('result', result);
                },
            }); // 上报drawFeed点击量
        }
    };

    AdRewardProgress(isAdMedia && index === VideoStore.viewableItemIndex);

    if (isAdMedia) {
        return (
            <View style={{ height: app.viewportHeight }}>
                <ad.DrawFeedAd
                    onError={(error: any) => {
                        setAdShow(false);
                    }}
                    onAdClick={() => getReward(media)}
                />
                {VideoStore.getReward.length < 1 && (
                    <View
                        style={{
                            bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(75),
                            position: 'absolute',
                            right: PxFit(Theme.itemSpace),
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={require('../../../assets/images/click_tips.png')}
                            style={{ width: (20 * 208) / 118, height: 20 }}
                        />
                        <Text
                            style={{
                                color: '#C0CBD4',
                                fontSize: PxFit(12),
                                marginHorizontal: PxFit(10),
                            }}>
                            戳一戳，获取更多奖励
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={{ height: VideoStore.viewportHeight }}>
            {video && video.cover && (
                <View style={styles.cover}>
                    <Image style={styles.curtain} source={{ uri: video.cover }} resizeMode="cover" blurRadius={4} />
                    <View style={styles.mask} />
                </View>
            )}
            {video && <Player media={video} index={index} />}

            <View style={styles.videoInfo}>
                <View style={styles.left}>
                    <Row>
                        <Text style={styles.name}>@{user.name}</Text>
                    </Row>
                    <View>
                        <Text style={styles.body}>{title ? title : description}</Text>
                    </View>
                </View>

                <SideBar media={media} user={user} isPost={isPost} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    body: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(14), paddingTop: PxFit(10) },
    cover: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    left: {
        flex: 1,
        justifyContent: 'flex-end',
        // paddingBottom: 10,
        paddingRight: 40,
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(15), fontWeight: 'bold' },
    videoInfo: {
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(30),
        flexDirection: 'row',
        left: 0,
        paddingHorizontal: PxFit(Theme.itemSpace),
        position: 'absolute',
        right: 0,
    },
    rewardWrap: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: PxFit(11),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: PxFit(12),
        height: PxFit(22),
        marginLeft: PxFit(10),
    },
    rewardTitle: {
        fontSize: PxFit(11),
        color: 'rgba(255,255,255,0.9)',
    },
    rewardCount: {
        marginLeft: PxFit(5),
        color: Theme.themeRed,
        fontSize: PxFit(11),
    },
});
