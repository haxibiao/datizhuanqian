import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PxFit, Theme, ISIOS, Tools } from 'utils';
import { ttad } from 'native';

import { observer, app } from 'store';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';
import { GQL, useMutation } from 'apollo';
import { exceptionCapture } from 'common';

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
            //发放给精力奖励
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

    if (media.is_ad_video && adShow && !ISIOS)
        return (
            <View style={{ height: VideoStore.viewportHeight }}>
                <ttad.DrawFeedAd
                    onError={(error: any) => {
                        console.log('error', error);
                        setAdShow(false);
                    }}
                    onAdClick={() => getReward(media)}
                />
            </View>
        );
    return (
        <View style={{ height: VideoStore.viewportHeight }}>
            {media.cover && (
                <View style={styles.cover}>
                    <Image style={styles.curtain} source={{ uri: media.cover }} resizeMode="cover" blurRadius={4} />
                    <View style={styles.mask} />
                </View>
            )}
            <Player media={media} index={index} />
            <View style={styles.videoInfo}>
                <View style={styles.left}>
                    <View>
                        <Text style={styles.name}>@{media.question.user.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.body}>{media.question.description}</Text>
                    </View>
                </View>
                <SideBar media={media} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    body: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(15), paddingTop: PxFit(10) },
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
        paddingBottom: 10,
        paddingRight: 40,
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(16), fontWeight: 'bold' },
    videoInfo: {
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(50),
        flexDirection: 'row',
        left: 0,
        paddingHorizontal: PxFit(Theme.itemSpace),
        position: 'absolute',
        right: 0,
    },
});
