import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from 'react-native';

import { Avatar, Iconfont, SafeText, MoreOperation } from 'components';
import { observer, app, config } from 'store';
import { useApolloClient } from '@src/apollo';
import { ApolloProvider } from '@apollo/react-hooks';

import Like from './Like';
import VideoStore from '../VideoStore';
import { useNavigation } from 'react-navigation-hooks';
import { Overlay } from 'teaset';

export default observer(props => {
    const { user, media, isPost } = props;
    const { video, count_comments } = media;
    const navigation = useNavigation();
    const client = useApolloClient();
    const showMoreOperation = useCallback(() => {
        let overlayRef;
        const MoreOperationOverlay = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={ref => (overlayRef = ref)}>
                <ApolloProvider client={client}>
                    <MoreOperation
                        onPressIn={() => overlayRef.close()}
                        target={media}
                        downloadUrl={Helper.syncGetter('video.url', media)}
                        downloadUrlTitle={Helper.syncGetter('body', media)}
                        options={['复制链接']}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );

        Overlay.show(MoreOperationOverlay);
    }, [client, media]);
    return (
        <View style={styles.sideBar}>
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    onPress={() => {
                        Helper.middlewareNavigate('User', { user: user });
                    }}>
                    <Avatar
                        source={user.avatar}
                        size={46}
                        userId={user.id}
                        style={{ borderColor: Theme.white, borderWidth: 1 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <Like media={isPost ? media : video} isPost={isPost} />
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={VideoStore.showComment}>
                    <Image source={require('@src/assets/images/comment_item.png')} style={styles.imageStyle} />
                    <Text style={styles.countText}>{Helper.count(isPost ? count_comments : video.count_comments)}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={showMoreOperation}>
                    <Image source={require('@src/assets/images/more_item.png')} style={styles.imageStyle} />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    sideBar: {
        marginBottom: PxFit(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap: {
        marginTop: PxFit(20),
    },
    imageStyle: {
        width: PxFit(32),
        height: PxFit(32),
    },
    countText: {
        textAlign: 'center',
        marginTop: PxFit(10),
        fontSize: PxFit(12),
        color: 'rgba(255,255,255,0.8)',
    },
});
