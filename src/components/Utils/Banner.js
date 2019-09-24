/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 11:41:39
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { Theme, SCREEN_WIDTH, PxFit } from '../../utils';

import ProgressWithdrawal from './ProgressWithdrawal';
import Iconfont from '../Iconfont';

import { BoxShadow } from 'react-native-shadow';

import { app } from 'store';

import { GQL, Query, compose, graphql } from 'apollo';

import { Overlay } from 'teaset';

const shadowOpt = {
    width: SCREEN_WIDTH,
    color: '#E8E8E8',
    border: 5,
    radius: 5,
    opacity: 0.2,
    x: 0,
    y: 5,
    style: {
        marginTop: 0,
    },
};
class Banner extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        const { isAnswer, data, navigation } = this.props;
        const { noTicketTips } = app;
        if (isAnswer && noTicketTips && data.user && data.user.ticket === 0) {
            this.showTips(navigation);
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const { showWithdraw, isShow, isAnswer, data } = this.props;
        let { login, me } = app;

        const { error, user } = data;
        if (error) return null;
        if (!(data && data.user)) return null;
        let progress = (data.user.exp / data.user.next_level_exp) * 100 + '%';
        let step = (data.user.gold / data.user.exchange_rate) * 5;
        let stepData = ['¥0.2', '¥0.4', '¥0.6', '¥0.8', '¥1.0'];
        return (
            <View style={styles.container}>
                <View style={styles.rowItem}>
                    <View
                        style={{
                            width: PxFit(28),
                            height: PxFit(28),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image source={require('../../assets/images/heart.png')} style={styles.iconImage} />
                    </View>
                    <Text style={styles.text}>精力点 </Text>
                    <Text
                        style={{
                            fontSize: PxFit(15),
                            color: user.ticket > 10 ? Theme.black : Theme.themeRed,
                        }}>
                        {user.ticket ? user.ticket : '0'}
                    </Text>
                    <Text style={styles.text}>/{user.level ? user.level.ticket_max : '180'}</Text>
                </View>
                <View style={styles.rowItem}>
                    <View
                        style={{
                            width: PxFit(28),
                            height: PxFit(28),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={require('../../assets/images/diamond.png')}
                            style={{
                                width: PxFit(23),
                                height: PxFit(25),
                                marginBottom: PxFit(2),
                            }}
                        />
                    </View>
                    <Text style={styles.text}>智慧点 </Text>
                    <Text style={styles.text}>{user.gold}</Text>
                </View>
                {
                    // <View style={styles.ticketUpperLimit}>
                    // <View style={[styles.ticketBar, { width: progress }]} />
                    // </View>
                }
                {
                    // <View style={styles.withdrawProgress}>
                    //     <ProgressWithdrawal step={parseInt(step)} data={stepData} />
                    // </View>
                }
            </View>

            //考虑到精力点是实时更新的  所以不将精力点存到redux中.
        );
    }

    showTips = navigation => {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.overlay}>
                    <View
                        style={{
                            width: (SCREEN_WIDTH * 2) / 3,
                            // height: (SCREEN_WIDTH * 4) / 6,
                            borderRadius: PxFit(5),
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: PxFit(20),
                            paddingHorizontal: PxFit(20),
                        }}>
                        <Text style={styles.tips}>精力点不足</Text>
                        <Image
                            source={require('../../assets/images/error.png')}
                            style={{ height: PxFit(120), width: PxFit(120), marginVertical: PxFit(20) }}
                        />
                        <View style={{ alignItems: 'center', paddingBottom: PxFit(10) }}>
                            <Text style={{ fontSize: PxFit(13), color: Theme.black, lineHeight: 22 }}>
                                答题将不再奖励智慧点
                            </Text>
                            <Text style={{ fontSize: PxFit(13), color: Theme.black, lineHeight: 22 }}>
                                每日零时将重置精力点
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('任务');
                                    Overlay.hide(this.OverlayKey);
                                    app.recordOperation(false);
                                }}
                                style={{ marginTop: PxFit(5) }}>
                                <Text
                                    style={{
                                        fontSize: PxFit(13),
                                        color: Theme.black,
                                        lineHeight: 22,
                                        textDecorationLine: 'underline',
                                        color: Theme.themeRed,
                                    }}>
                                    看激励视频可快速恢复精力点
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ width: 1, height: 26, backgroundColor: '#F0F0F0' }} />
                        <TouchableOpacity
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: '#F0F0F0',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                Overlay.hide(this.OverlayKey);
                                app.recordOperation(false);
                            }}>
                            <Iconfont name={'close'} color={'#F0F0F0'} size={28} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    };
}

const styles = StyleSheet.create({
    container: {
        height: PxFit(40),
        backgroundColor: Theme.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: PxFit(0.5),
    },
    rowItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: PxFit(24),
        height: PxFit(25),
    },
    text: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
    },
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tips: {
        fontSize: PxFit(20),
        paddingTop: PxFit(5),
        color: Theme.theme,
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: Theme.primaryColor,
    },
    ticketUpperLimit: {
        height: PxFit(2),
        backgroundColor: '#E8E8E8',
        overflow: 'hidden',
    },
    ticketBar: {
        alignSelf: 'auto',
        flex: 1,
        backgroundColor: Theme.primaryColor,
    },
    withdrawProgress: {
        paddingHorizontal: PxFit(Theme.itemSpace),
        paddingBottom: PxFit(10),
        backgroundColor: '#fff',
    },
});

export default compose(
    graphql(GQL.UserMetaQuery, {
        options: props => ({ variables: { id: app.me.id } }),
        fetchPolicy: 'network-only',
    }),
)(Banner);
