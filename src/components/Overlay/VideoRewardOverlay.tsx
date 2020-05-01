import React, { Fragment, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import { Overlay } from 'teaset';
import { ad } from 'native';
import { playVideo } from '../../common/ad/playVideo';
import { TouchFeedback, Iconfont, Row, Button } from '@src/components';
import { app } from '@src/store';
interface Reward {
    gold?: number;
    ticket?: number;
    contribute?: number;
}

interface Props {
    reward: Reward;
    title: string;
    rewardVideo: boolean;
    type: any;
}

let OverlayKey: any = null;

const rewardTitle = (rewardList: { value: any; name: any }[]) => {
    return (
        <Text style={styles.title}>
            领取成功
            <Text style={{ color: Theme.themeRed }}>{` 获得${rewardList[0].value + rewardList[0].name}`}</Text>
        </Text>
    );
};

const VideoRewardOverlay = props => {
    const { reward, title, rewardVideo, type } = props;
    const { gold, ticket, contribute } = reward;
    const [adShow, setAdShow] = useState(false);

    const constructRewardList = [
        {
            value: gold || 0,
            name: gold ? '智慧点' : null,
            image: require('@src/assets/images/heart.png'),
        },
        {
            value: ticket || 0,
            name: ticket ? '精力点' : null,
            image: require('@src/assets/images/heart.png'),
            style: styles.iconImage,
        },
        {
            value: contribute || 0,
            name: contribute ? '贡献点' : null,
            image: require('@src/assets/images/contribute.png'),
            style: styles.contributeImage,
        },
    ];

    const rewardList = constructRewardList.filter(elem => {
        return elem.value > 0;
    });

    const body = rewardList.length > 1 ? '额外奖励' : title || '领取奖励成功';
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.content,
                    adShow ? {} : { borderBottomLeftRadius: PxFit(10), borderBottomRightRadius: PxFit(10) },
                ]}>
                <TouchFeedback style={styles.operation} onPress={hide}>
                    <Iconfont name={'close'} color={'#D8D8D8'} size={Font(16)} />
                </TouchFeedback>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('@src/assets/images/bg_reward_overlay_top.png')}
                        style={styles.headerImage}
                    />
                </View>
                <View style={styles.header}>
                    <View style={{}}>
                        {rewardTitle(rewardList)}
                        <View style={styles.rewardContainer}>
                            <Text style={{ color: Theme.grey }}>{body}</Text>

                            {rewardList.slice(1).map((data, index) => {
                                return (
                                    <Fragment key={index}>
                                        {/*  <Image source={data.image} style={data.style} /> */}
                                        <Text style={{ color: Theme.theme, paddingLeft: PxFit(3) }}>
                                            {data.value}
                                            <Text style={{ color: Theme.theme }}>{data.name}</Text>
                                        </Text>
                                    </Fragment>
                                );
                            })}
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: PxFit(5), paddingBottom: PxFit(15) }}>
                    <Button
                        style={styles.button}
                        textColor={'#623605'}
                        title={'智慧点翻倍'}
                        onPress={() => {
                            hide();
                            playVideo({
                                type,
                            });
                        }}
                    />
                </View>
                <Row style={{ justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontSize: Font(13),
                            color: '#999999',
                        }}>
                        当前智慧点:
                    </Text>
                    <Image
                        source={require('@src/assets/images/diamond.png')}
                        style={{ width: PxFit(17), height: PxFit(17), marginHorizontal: PxFit(3) }}
                    />
                    <Text
                        style={{
                            fontSize: Font(13),
                            color: '#999999',
                        }}>
                        {app.userCache.gold}
                        <Text style={{ color: Theme.themeRed }}>≈{Helper.money(app.userCache)}元</Text>
                    </Text>
                </Row>
            </View>
            {adShow && (
                <Image
                    source={require('@src/assets/images/bg_feed_overlay_line.png')}
                    style={{
                        width: Device.WIDTH - PxFit(48),
                        height: ((Device.WIDTH - PxFit(48)) * 30) / 640,
                    }}
                />
            )}

            <View
                style={{
                    width: Device.WIDTH - PxFit(48),
                    backgroundColor: '#FFF',
                    borderBottomLeftRadius: PxFit(10),
                    borderBottomRightRadius: PxFit(10),
                }}>
                <ad.FeedAd
                    adWidth={Device.WIDTH - PxFit(50)}
                    onAdShow={() => {
                        setAdShow(true);
                    }}
                />
            </View>
        </View>
    );
};

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated>
            <VideoRewardOverlay {...props} />
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
export const hide = () => {
    Overlay.hide(OverlayKey);
};

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

        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingBottom: PxFit(15),
        borderTopLeftRadius: PxFit(10),
        borderTopRightRadius: PxFit(10),
        // alignItems: 'center',
    },
    contributeImage: {
        width: 15,
        height: 15,
        marginLeft: 3,
        paddingTop: 2,
        marginRight: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: PxFit(25),
        marginBottom: PxFit(15),
    },
    headerImage: {
        width: (Device.WIDTH * 0.32 * 318) / 216,
        height: Device.WIDTH * 0.32,
        marginTop: PxFit(-75),
    },

    iconImage: {
        width: 19,
        height: 19,
        marginLeft: 3,
        marginRight: 2,
    },
    modalFooter: {
        borderTopWidth: PxFit(0.5),
        borderTopColor: Theme.tintGray,
        flexDirection: 'row',
        marginTop: PxFit(15),
    },
    operation: {
        position: 'absolute',
        right: PxFit(0),
        top: PxFit(0),
        paddingTop: PxFit(10),
        paddingHorizontal: PxFit(15),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    operationText: {
        fontSize: PxFit(15),
        fontWeight: '400',
        color: Theme.grey,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    },

    button: {
        backgroundColor: '#FCE03D',
        borderRadius: PxFit(19),
        height: PxFit(38),
        width: Device.WIDTH * 0.6,
    },
    title: {
        fontSize: Font(18),
        color: Theme.black,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default { show, hide };
