import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Config, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Theme } from 'utils';

import { observer } from 'store';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';

export default observer(props => {
    const { media, height } = props;
    return (
        <View style={{ height }}>
            <Player media={media} />
            <View style={styles.videoInfo}>
                <View style={styles.left}>
                    <View>
                        <Text style={styles.name}>@{media.user.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.body}>{media.body}</Text>
                    </View>
                </View>
                <SideBar media={media} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    videoInfo: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: PxFit(Theme.itemSpace),
        bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(50),
        flexDirection: 'row',
    },
    left: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingRight: 40,
        paddingBottom: 10,
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(16), fontWeight: 'bold' },
    body: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(15), paddingTop: PxFit(10) },
});
