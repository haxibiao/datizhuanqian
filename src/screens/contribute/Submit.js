/*
 * @flow
 * created by wyk made in 2019-03-13 10:17:11
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { PageContainer, TipsOverlay, ErrorOverlay } from 'components';
import { playVideo } from 'common';
import { config } from 'store';
import { ad } from 'native';

class Submit extends Component {
    render() {
        let { navigation } = this.props;
        let status, content, noTicket;
        noTicket = navigation.getParam('noTicket', false);
        if (noTicket) {
            status = '暂存成功';
            content = '您的题目已经保存到草稿箱，可以在“我的出题”中查看。';
        } else {
            status = '提交成功';
            content = '系统会尽快审核您的题目，请耐心等待哦!';
        }
        return (
            <PageContainer title="提交结果" white>
                <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.submitContainer}>
                        <ImageBackground source={require('../../assets/images/submit.png')} style={styles.submitImage}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.submitStatus}>{status}</Text>
                                <Text style={styles.submitTip}>{content}</Text>
                            </View>
                        </ImageBackground>
                        <View style={styles.buttonContaiber}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    Helper.middlewareNavigate('任务');
                                    playVideo({
                                        type: 'Contribute',
                                        noReward: true,
                                        callback: () => {
                                            // TipsOverlay.show({
                                            //     title: '审题已加速',
                                            //     content: (
                                            //         <View>
                                            //             {config.enableBanner && (
                                            //                 <ad.FeedAd adWidth={Device.WIDTH - PxFit(40)} />
                                            //             )}
                                            //         </View>
                                            //     ),
                                            //     onConfirm: () => {
                                            //         Helper.middlewareNavigate('MyPublish', { initialPage: 1 });
                                            //         TipsOverlay.hide();
                                            //     },
                                            // });

                                            ErrorOverlay.show({
                                                title: '审题已加速',
                                                content: '会优先推荐您的出题',
                                                buttonName: '查看出题',
                                                action: () => {
                                                    Helper.middlewareNavigate('MyPublish', { initialPage: 1 });
                                                },
                                            });
                                        },
                                    });
                                }}>
                                <Text style={{ fontSize: PxFit(16), color: '#fff' }}>加速审核</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonBorder]}
                                onPress={() => navigation.replace('Contribute')}>
                                <Text style={{ fontSize: PxFit(16), color: Theme.primaryColor }}>继续出题</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    submitContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: PxFit(30),
    },
    submitImage: {
        width: Device.WIDTH * 0.52,
        height: Device.WIDTH * 0.65,
        resizeMode: 'contain',
        paddingTop: Device.WIDTH * 0.07,
        paddingHorizontal: Device.WIDTH * 0.055,
    },
    submitStatus: {
        fontSize: PxFit(17),
        color: '#212121',
        fontWeight: '500',
        marginBottom: PxFit(15),
    },
    submitTip: {
        fontSize: PxFit(14),
        color: '#969696',
        lineHeight: PxFit(18),
    },
    buttonContaiber: {
        marginTop: PxFit(40),
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: (Device.WIDTH * 4) / 5,
        height: PxFit(42),
        borderRadius: PxFit(21),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.primaryColor,
    },
    buttonBorder: {
        backgroundColor: '#fff',
        borderWidth: PxFit(1),
        borderColor: Theme.primaryColor,
        marginTop: PxFit(20),
    },
});

export default Submit;
