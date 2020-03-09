/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';

import { Iconfont, TouchFeedback, Row } from '@src/components';

import { Overlay } from 'teaset';

import DownLoadApk from '@src/components/Utils/DownLoadApk';

class DameiIntro {
    static OverlayKey: any;

    static show() {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Row style={{ marginTop: PxFit(25) }}>
                            <Image source={require('@src/assets/images/damei.png')} style={styles.icon} />
                            <View style={{ marginLeft: PxFit(10) }}>
                                <Text style={styles.title}>答妹</Text>
                                <Text style={styles.appInfo} numberOfLines={1}>
                                    书中只有颜如玉
                                </Text>
                            </View>
                        </Row>
                        <View style={styles.intro}>
                            <Text style={styles.text}>
                                答妹是答题赚钱旗下的青春简洁版，同样享受百万题库，知识问答，是学习赚钱的不二之选。
                            </Text>

                            <Text style={styles.text}>1.下载安装打开答妹</Text>
                            <Text style={styles.text}>2.使用一键登录App</Text>
                            <Text style={styles.text}>
                                3.回到{Config.AppName}，提现到答妹，在答妹内将余额提现到支付宝
                            </Text>
                            <Text style={styles.text}>
                                4：{Config.AppName}
                                将自动绑定一键登录的答妹账号，请勿手动注册账号哦！如遇无法绑定的问题，请联系官方QQ群：735220029
                            </Text>
                        </View>
                        <View style={{ marginBottom: PxFit(20), marginTop: PxFit(30) }}>
                            <DownLoadApk
                                hide={() => {
                                    Overlay.hide(this.OverlayKey);
                                }}
                                name={'答妹'}
                                packageName={'con.damei'}
                                url={'http://dtzq-1251052432.cos.ap-shanghai.myqcloud.com/damei-release.apk'}
                            />
                        </View>
                    </View>
                    <TouchFeedback
                        style={{ marginTop: PxFit(40), alignItems: 'center' }}
                        onPress={() => {
                            Overlay.hide(this.OverlayKey);
                        }}>
                        <View style={styles.close}>
                            <Iconfont name={'close'} color={'#FFF'} size={30} />
                        </View>
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
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: Device.WIDTH - PxFit(48),
        borderRadius: PxFit(6),
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    title: {
        fontSize: PxFit(17),
        color: '#000',
    },

    appInfo: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
        marginTop: PxFit(3),
    },
    intro: {
        marginVertical: PxFit(20),
        paddingHorizontal: PxFit(25),
    },
    icon: {
        width: PxFit(42),
        height: PxFit(42),
        borderRadius: PxFit(5),
    },
    text: {
        lineHeight: PxFit(18),
        color: Theme.subTextColor,
        paddingTop: PxFit(6),
        fontSize: PxFit(14),
    },
    close: {
        width: PxFit(42),
        height: PxFit(42),
        borderRadius: PxFit(29),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: PxFit(1),
    },
});

export default DameiIntro;
