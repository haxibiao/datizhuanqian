import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PxFit, Theme, SCREEN_HEIGHT } from 'utils';

import { observer } from 'store';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media, index } = props;
    console.log('VideoStore.viewportHeight', VideoStore.viewportHeight);
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
