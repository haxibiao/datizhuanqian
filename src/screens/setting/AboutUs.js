/*
 * @flow
 * created by wyk made in 2019-03-21 14:13:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';
import { config } from 'store';

class AboutUs extends Component {
    render() {
        return (
            <PageContainer title={'关于' + Config.AppName} white>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' }}>
                        <View style={{ marginTop: PxFit(30) }}>
                            <View style={{ alignItems: 'center', paddingVertical: PxFit(15) }}>
                                <Image
                                    source={require('../../../icon.png')}
                                    style={{
                                        width: SCREEN_WIDTH / 4,
                                        height: SCREEN_WIDTH / 4,
                                        borderRadius: SCREEN_WIDTH / 8,
                                    }}
                                />
                                <Text style={styles.AppVersion}>
                                    {Config.AppName} {Config.AppVersion}
                                </Text>
                            </View>
                            <View style={{ paddingHorizontal: PxFit(20) }}>
                                <Text style={styles.sectionTitle}>关于答题</Text>
                                <Text style={styles.appIntro}>
                                    {Config.AppName}
                                    是一款手机休闲益智答题软件,有地理，英文，历史，科学，世界趣闻等知识分类。
                                    答题题目将不断更新，让您随时学到新的知识。成功答题的您还能获得收益哦！在等朋友,等公交,等吃饭或其他碎片时间。
                                    玩{Config.AppName}
                                    学知识{!config.disableAd ? '拿金钱' : null}
                                    ，是您killtime的最佳搭档。如果你觉得你掌握的知识够全面就快来
                                    {Config.AppName}吧，各国趣味知识，涵盖天文、地理、历史科学应有尽有。
                                    {!config.disableAd ? '只要你能答对就能赚取相应报酬，' : null}快来{Config.AppName}
                                    试试身手吧。
                                </Text>
                            </View>

                            <View style={{ marginTop: PxFit(30) }}>
                                <View style={{ paddingHorizontal: PxFit(20) }}>
                                    <Text style={styles.sectionTitle}>联系我们</Text>
                                    {/*<Text style={{ fontSize: 13, color: Theme.subTextColor, marginTop: 15 }}>QQ交流群: 4337413</Text>*/}
                                    <Text style={styles.officialText}>官网地址： datizhuanqian.com</Text>
                                    <Text style={styles.officialText}>商务合作： db@xiaodamei.com</Text>
                                    <Text style={styles.officialText}>新浪微博： 答题赚钱APP</Text>
                                    <Text style={styles.officialText}>微信公众号：答赚</Text>
                                    <Text style={styles.officialText}>官方QQ群： 735220029</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.copyright}>
                            <Text>近邻乐(深圳)有限责任公司</Text>
                            <Text>www.datizhuanqian.com</Text>
                        </View>
                    </View>
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Theme.white,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT || PxFit(15),
    },
    AppVersion: { color: Theme.defaultTextColor, fontSize: PxFit(15), margin: PxFit(20) },
    sectionTitle: { fontSize: 15, color: Theme.defaultTextColor },
    appIntro: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
        marginTop: PxFit(15),
        lineHeight: PxFit(18),
        fontWeight: '300',
    },
    officialText: { fontSize: PxFit(13), color: Theme.subTextColor, marginTop: PxFit(10) },
    copyright: {
        paddingTop: PxFit(15),
        alignItems: 'center',
    },
});

export default AboutUs;
