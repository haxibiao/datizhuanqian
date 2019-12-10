import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from 'react-native';

import { Avatar, Iconfont, SafeText, MoreOperation } from 'components';
import { observer, app, config } from 'store';
import { useApolloClient } from '@src/apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import { PxFit, Theme, Tools } from 'utils';
import Like from './Like';
import VideoStore from '../VideoStore';
import { useNavigation } from 'react-navigation-hooks';
import { Overlay } from 'teaset';

export default observer(props => {
    const { media } = props;
    const navigation = useNavigation();
    const client = useApolloClient();
    const showMoreOperation = useCallback(() => {
        if (!app.firstOpenVideoOperation) {
            app.setOpenVideoOperation(true);
            Tools.navigate('VideoPost', { medium: [VideoStore.guidanceVideo], isPost: true });
        }
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
                        downloadUrl={Tools.syncGetter('video.url', media)}
                        downloadUrlTitle={Tools.syncGetter('body', media)}
                        options={['采集视频', '不感兴趣', '举报']}
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
                        navigation.navigate('User', { user: media.user });
                    }}>
                    <Avatar source={media.user.avatar} size={46} style={{ borderColor: Theme.white, borderWidth: 1 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <Like media={media} />
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={VideoStore.showComment}>
                    <Image source={require('@src/assets/images/comment_item.png')} style={styles.imageStyle} />
                    <SafeText style={styles.countText} shadowText={true}>
                        {Tools.NumberFormat(Tools.syncGetter('count_comments', media))}
                    </SafeText>
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={showMoreOperation}>
                    <Image
                        source={
                            app.firstOpenVideoOperation || config.disableAd
                                ? require('@src/assets/images/more_item.png')
                                : require('@src/assets/images/first_capture_video.png')
                        }
                        style={styles.imageStyle}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    countText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: PxFit(12),
        marginTop: PxFit(10),
        textAlign: 'center',
    },
    imageStyle: {
        height: PxFit(40),
        width: PxFit(40),
    },
    itemWrap: {
        marginTop: PxFit(20),
    },
    sideBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
