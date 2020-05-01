import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Overlay } from 'teaset';

import { app, storage, keys } from 'store';
import { TouchFeedback } from '../TouchableView';

interface Props {
    callback?: Function;
}

let OverlayKey: any = null;

const UserAgreementOverlay = props => {
    console.log('props :>> ', props);
    const { callback } = props;

    const [tick, setTick] = useState(true);

    return (
        <View style={styles.overlayView}>
            <View style={styles.row}>
                <Text style={styles.title}>用户协议与隐私政策</Text>
            </View>

            <View>
                <Text style={styles.head}>欢迎使用答题赚钱APP！</Text>
                <Text style={styles.text}>
                    我们非常重视您的个人信息和隐私保护。
                    为了更好地保障您的个人权益，在您使用答题赚钱产品与服务前，请您认真阅读并充分理解
                    <Text style={{ fontWeight: 'bold', fontSize: Font(14) }}>《用户协议》</Text>和
                    <Text style={{ fontWeight: 'bold', fontSize: Font(14) }}>《隐私政策》</Text>
                    。当您点击同意，并开始使用产品服务时，即表示您已经理解并同意该条款内容，该条款将对您产品法律的约束力。
                </Text>
            </View>

            <View style={{ marginTop: PxFit(10) }}>
                <TouchableOpacity
                    style={styles.row}
                    activeOpacity={1}
                    onPress={() => {
                        hide();
                        setTick(!tick);
                    }}>
                    <Image
                        source={
                            tick ? require('@src/assets/images/tick.png') : require('@src/assets/images/istick.png')
                        }
                        style={styles.tick}
                    />
                    <Text style={{ fontSize: Font(12), color: '#797979' }}>
                        我已阅读并同意
                        <Text
                            style={{ fontSize: Font(12), color: Theme.primaryColor }}
                            onPress={() => {
                                hide();
                                Helper.middlewareNavigate('UserProtocol');
                            }}>
                            《用户协议》
                        </Text>
                        和
                        <Text
                            style={{ fontSize: Font(12), color: Theme.primaryColor }}
                            onPress={() => {
                                hide();
                                Helper.middlewareNavigate('PrivacyPolicy');
                            }}>
                            《隐私政策》
                        </Text>
                    </Text>
                </TouchableOpacity>
                <TouchFeedback
                    style={styles.bottom}
                    activeOpacity={1}
                    onPress={() => {
                        if (tick) {
                            // app.createUserAgreement = false;
                            // storage.setItem(keys.createUserAgreement, true);
                            hide();
                            callback && callback();
                        }
                    }}>
                    <Text style={{ fontWeight: 'bold', fontSize: Font(16), color: '#623605' }}>知道了</Text>
                </TouchFeedback>
            </View>
        </View>
    );
};

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated style={{ justifyContent: 'center' }}>
            <UserAgreementOverlay {...props} />
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayView: {
        marginHorizontal: '8%',
        minHeight: '50%',
        paddingHorizontal: PxFit(20),
        paddingVertical: PxFit(15),
        borderRadius: 15,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    head: {
        fontSize: Font(15),
        color: '#797979',
        marginBottom: PxFit(25),
        marginTop: PxFit(10),
    },
    text: {
        fontSize: Font(14),
        color: '#797979',
        lineHeight: Font(22),
    },
    tick: {
        width: PxFit(16),
        height: PxFit(16),
        marginRight: 5,
    },
    bottom: {
        paddingVertical: PxFit(10),
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 20,
        backgroundColor: '#FCE13D',
    },
});

export default { show, hide };
