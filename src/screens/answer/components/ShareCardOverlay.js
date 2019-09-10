/*
 * @Author: Gaoxuan
 * @Date:   2019-07-19 16:30:05
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Image, ScrollView } from 'react-native';
import { Overlay } from 'teaset';
import { SafeText, TouchFeedback, ItemSeparator, Iconfont } from '../../../components';

import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Api } from '../../../utils';
import { Share } from 'native';
import ShareCard from './ShareCard';

class ShareCardOverlay {
    static show(result, question) {
        let overlayView = (
            <Overlay.View animated>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ height: 25 }} />
                    <ShareCard question={question} ref={ref => (this._shareCard = ref)} />
                </ScrollView>
                <View style={{ backgroundColor: '#FFF' }}>
                    <View style={styles.top}>
                        <TouchFeedback
                            onPress={async () => {
                                ShareCardOverlay.hide();
                                Share.shareWechatMoment(result).then(data => {
                                    if (!data) {
                                        Toast.show({
                                            content: '请先安装微信客户端',
                                        });
                                    }
                                });
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../../assets/images/friends.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>朋友圈</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                ShareCardOverlay.hide();
                                Share.shareWechat(result).then(data => {
                                    if (!data) {
                                        Toast.show({
                                            content: '请先安装微信客户端',
                                        });
                                    }
                                });
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../../assets/images/wechat.png')} style={styles.imageStyle} />

                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微信好友</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                ShareCardOverlay.hide();
                                Share.shareImageToQQ(result).then(data => {
                                    if (!data) {
                                        Toast.show({
                                            content: '请先安装QQ客户端',
                                        });
                                    }
                                });
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../../assets/images/qq.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                ShareCardOverlay.hide();
                                Share.shareToSinaFriends(result).then(data => {
                                    if (!data) {
                                        Toast.show({
                                            content: '请先安装微博客户端',
                                        });
                                    }
                                });
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../../assets/images/weibo.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                ShareCardOverlay.hide();
                                Share.shareImageToQQZone(result).then(data => {
                                    if (!data) {
                                        Toast.show({
                                            content: '请先安装QQ空间客户端',
                                        });
                                    }
                                });
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../../assets/images/qzone.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ空间</Text>
                        </TouchFeedback>
                    </View>
                    <TouchFeedback
                        style={styles.closeItem}
                        onPress={() => {
                            ShareCardOverlay.hide();
                        }}>
                        <Text style={styles.headerText}>取消</Text>
                    </TouchFeedback>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

const styles = StyleSheet.create({
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    imageStyle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginBottom: 10,
    },
    headerText: {
        fontSize: PxFit(15),
        color: Theme.confirmColor,
        textAlign: 'center',
    },
    closeItem: {
        height: PxFit(40),
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: PxFit(6),
    },
});

export default ShareCardOverlay;
