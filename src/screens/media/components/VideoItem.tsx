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
import { Row } from 'components';

export default observer(props => {
    const { spider, index, navigation } = props;
    console.log('spider', spider);
    const { video, title } = spider;
    console.log('video', video);
    const { user } = video;
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
                        <Text style={styles.body}>{title}</Text>
                    </View>
                </View>

                <SideBar video={video} user={user} />
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
