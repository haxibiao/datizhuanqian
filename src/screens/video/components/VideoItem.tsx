import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SafeText } from 'components';
import { PxFit, Theme, ISIOS, Tools } from 'utils';
import { ttad } from 'native';
import { observer, app } from 'store';
import { GQL, useMutation } from 'apollo';
import { exceptionCapture } from 'common';

import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media, index } = props;
    const [adShow, setAdShow] = useState(true);

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
                });
            }
        }
    };
    if (media.is_ad_video && adShow && !ISIOS) {
        return (
            <View style={{ height: app.viewportHeight }}>
                <ttad.DrawFeedAd
                    onError={(error: any) => {
                        setAdShow(false);
                    }}
                    onAdClick={() => getReward(media)}
                />
            </View>
        );
    }

    return (
        <View style={{ height: app.viewportHeight }}>
            {media.cover && (
                <View style={styles.cover}>
                    <Image style={styles.curtain} source={{ uri: media.cover }} resizeMode="cover" blurRadius={4} />
                    <View style={styles.mask} />
                </View>
            )}
            <Player media={media} index={index} />
            <View style={styles.videoContent}>
                <View>
                    <SafeText shadowText={true} style={styles.name}>
                        @{Tools.syncGetter('question.user.name', media)}
                    </SafeText>
                </View>
                <View>
                    <SafeText shadowText={true} style={styles.body} numberOfLines={3}>
                        {Tools.syncGetter('question.description', media)}
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
