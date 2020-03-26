/*
 * @Author: Gaoxuan
 * @Date:   2019-07-18 11:20:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont } from 'components';
import { Config, SCREEN_WIDTH } from 'utils';

import { viewShotUtil } from 'common';

import { Overlay } from 'teaset';
import { WeChat, Share } from 'native';

import QRCode from 'react-native-qrcode-svg';
import { app } from 'store';

class AppShareCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        ShareOverlay.show(this.onCapture, app.me);
    }

    render() {
        return (
            <PageContainer
                white
                title="邀请好友"
                rightView={
                    <TouchFeedback
                        onPress={() => ShareOverlay.show(this.onCapture, app.me)}
                        style={{ flex: 1, justifyContent: 'center' }}>
                        <Iconfont name={'share'} size={20} color={Theme.black} />
                    </TouchFeedback>
                }>
                <ScrollView style={{ flex: 1 }} ref={ref => (this.shareCard = ref)}>
                    <View style={{ width: SCREEN_WIDTH, height: (SCREEN_WIDTH * 1334) / 720 }}>
                        <Image
                            source={require('../../assets/images/app-share-card.png')}
                            style={{ width: SCREEN_WIDTH, height: (SCREEN_WIDTH * 1334) / 720 }}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                marginTop: ((-(SCREEN_WIDTH * 1334) / 720) * 2) / 3,
                                backgroundColor: 'transparent',
                            }}>
                            <QRCode
                                value={`https://datizhuanqian.com/invitation?user_id=${app.me.id}`}
                                size={SCREEN_WIDTH / 3}
                                color={'#000'}
                                backgroundColor={'#FFF'}
                            />
                        </View>
                    </View>
                </ScrollView>
            </PageContainer>
        );
    }

    onCapture = async isShow => {
        let image = await viewShotUtil.capture(this.shareCard);
        let result = await viewShotUtil.saveImage(image, isShow);
        return result;
    };
}

class ShareOverlay {
    static show(onCapture, user) {
        let overlayView = (
            <Overlay.PullView style={{ flexDirection: 'column', justifyContent: 'flex-end' }} animated>
                <View style={{ backgroundColor: '#FFF' }}>
                    <View style={styles.top}>
                        <TouchFeedback
                            onPress={async () => {
                                ShareOverlay.hide();
                                let result = await onCapture();

                                let callback = await Share.shareWechatMoment(result);

                                if (callback == false) {
                                    Toast.show({
                                        content: '请先安装微信客户端',
                                    });
                                }

                                console.log('callback', callback);
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/images/friends.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>朋友圈</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={() => {
                                this.shareMiniProgram(user);
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/images/wechat.png')} style={styles.imageStyle} />

                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微信好友</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                ShareOverlay.hide();
                                let result = await onCapture();
                                let callback = await Share.shareImageToQQ(result);

                                if (callback == false) {
                                    Toast.show({
                                        content: '请先安装QQ客户端',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/images/qq.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                ShareOverlay.hide();
                                let result = await onCapture();
                                let callback = await Share.shareToSinaFriends(result);

                                if (callback == false) {
                                    Toast.show({
                                        content: '请先安装微博客户端',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/images/weibo.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                ShareOverlay.hide();
                                let result = await onCapture();
                                let callback = await Share.shareImageToQQZone(result);

                                if (callback == false) {
                                    Toast.show({
                                        content: '请先安装QQ空间客户端',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/images/qzone.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ空间</Text>
                        </TouchFeedback>
                    </View>
                    <TouchFeedback
                        style={styles.closeItem}
                        onPress={() => {
                            ShareOverlay.hide();
                        }}>
                        <Text style={styles.headerText}>取消</Text>
                    </TouchFeedback>
                </View>
            </Overlay.PullView>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }

    static shareMiniProgram(user) {
        this.getWechatConfig(user);
    }

    static getWechatConfig(user) {
        fetch(Config.ServerRoot + '/api/app/config/wechat-mg-share-config?api_token=' + user.token)
            .then(response => response.json())
            .then(data => {
                WeChat.shareMiniProgram({
                    title: '分享好友赚钱',
                    miniprogramType: data.miniprogramType,
                    userName: data.userName,
                    path: data.path,
                    webpageUrl: data.webpageUrl,
                });
                ShareOverlay.hide();
            });
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
    closeItem: {
        height: PxFit(40),
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: PxFit(6),
    },
    headerText: {
        fontSize: PxFit(15),
        color: Theme.confirmColor,
        textAlign: 'center',
    },
});

export default AppShareCard;
