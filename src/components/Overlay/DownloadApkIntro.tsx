/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
// import { Row, TouchFeedback, Iconfont } from '@src/components';

import Iconfont from '../Iconfont';
import TouchFeedback from '../TouchableView/TouchFeedback';
import Row from '../Container/Row';

import { Overlay } from 'teaset';

import DownLoadApk from '../Utils/DownLoadApk';

class DownloadApkIntro {
    static OverlayKey: any;

    static show(createWithdraw, value) {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Row style={{ marginTop: PxFit(25) }}>
                            <Image source={require('@src/assets/images/dongdezhuan.png')} style={styles.icon} />
                            <View style={{ marginLeft: PxFit(5) }}>
                                <Text style={styles.title}>懂得赚</Text>
                                <Text style={styles.appInfo} numberOfLines={1}>
                                    高收益，秒提现，不限时，不限额！
                                </Text>
                            </View>
                        </Row>
                        <View style={styles.intro}>
                            <Text style={styles.text}>
                                懂得赚是答题赚钱、答妹等时下热门赚钱APP的官方专属钱包，汇聚百款赚钱APP收益一键提现，不限时秒提现，是千万网赚用户必备的赚钱提现法宝。
                            </Text>

                            <Text style={styles.text}>1.下载安装打开懂得赚</Text>
                            <Text style={styles.text}>2.自动绑定懂得赚登录账号</Text>
                            <Text style={styles.text}>
                                3.回到{Config.AppName}，提现到懂得赚，在懂得赚内将余额提现到支付宝
                            </Text>
                            <Text
                                style={{
                                    color: Theme.grey,
                                    paddingTop: PxFit(6),
                                    fontSize: PxFit(13),
                                }}>
                                温馨提示：{Config.AppName}
                                将自动绑定同设备懂得赚账号，不支持绑定手机号！如遇无法绑定的问题，请联系官方QQ群：735220029
                            </Text>
                        </View>
                        <View style={{ marginBottom: PxFit(20), marginTop: PxFit(30) }}>
                            <DownLoadApk
                                hide={() => {
                                    Overlay.hide(this.OverlayKey);
                                }}
                                createWithdraw={createWithdraw}
                                value={value}
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
        width: PxFit(58),
        height: PxFit(58),
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

export default DownloadApkIntro;
