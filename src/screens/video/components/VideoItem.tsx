import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SafeText, Row } from 'components';
import { PxFit, Theme, ISIOS, Tools } from 'utils';
import { ttad } from 'native';
import { observer, app, config } from 'store';
import { GQL, useMutation } from 'apollo';
import { exceptionCapture } from 'common';

import Player from './Player';
import SideBar from './SideBar';
import AdRewardProgress from './AdRewardProgress';
import VideoStore from '../VideoStore';

import service from 'service';

export default observer(props => {
    const { media, index } = props;
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
                const contribute = Tools.syncGetter('data.userReward.contribute', res);
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
                <ttad.DrawFeedAd
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
        <View style={{ height: app.viewportHeight }}>
            {media.video.cover && (
                <View style={styles.cover}>
                    <Image
                        style={styles.curtain}
                        source={{ uri: media.video.cover }}
                        resizeMode="cover"
                        blurRadius={4}
                    />
                    <View style={styles.mask} />
                </View>
            )}
            <Player media={media} index={index} />
            <View style={styles.videoContent}>
                <Row>
                    <SafeText shadowText={true} style={styles.name}>
                        @{Tools.syncGetter('user.name', media)}
                    </SafeText>
                    <SafeText shadowText={true} style={styles.time}>{` ${Tools.syncGetter(
                        'created_at',
                        media,
                    )}`}</SafeText>
                </Row>
                <View>
                    <SafeText shadowText={true} style={styles.body} numberOfLines={3}>
                        {Tools.syncGetter('description', media)}
                    </SafeText>
                </View>
            </View>
            <View style={styles.videoSideBar}>
                <SideBar media={media} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    body: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(15), paddingTop: PxFit(10) },
    categoryName: {
        fontWeight: 'bold',
    },
    cover: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    curtain: {
        alignItems: 'center',
        flex: 1,
        height: null,
        justifyContent: 'center',
        width: null,
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(16), fontWeight: 'bold' },
    time: {
        color: Theme.grey,
        fontSize: PxFit(15),
    },
    videoContent: {
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(80),
        left: PxFit(Theme.itemSpace),
        position: 'absolute',
        right: PxFit(90),
    },
    videoSideBar: {
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(80),
        position: 'absolute',
        right: PxFit(Theme.itemSpace),
    },
});
