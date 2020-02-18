import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import { Overlay } from 'teaset';
import { ad } from 'native';
import { playVideo } from '../../common/ad/playVideo';

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
            恭喜获得
            <Text style={{ color: Theme.themeRed }}>{rewardList[0].value + rewardList[0].name}</Text>
        </Text>
    );
};

export const show = (props: Props) => {
    const { reward, title, rewardVideo, type } = props;
    const { gold, ticket, contribute } = reward;

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

    const body = rewardList.length > 1 ? '同时奖励' : '领取奖励成功';
    const overlayView = (
        <Overlay.View animated>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Image source={require('@src/assets/images/money_old.png')} style={styles.headerImage} />
                        <View style={{ marginLeft: PxFit(15) }}>
                            {rewardTitle(rewardList)}
                            <View style={styles.rewardContainer}>
                                <Text style={{ color: Theme.grey }}>{title ? title : body}</Text>

                                {rewardList.slice(1).map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <Image source={data.image} style={data.style} />
                                            <Text>+{data.value}</Text>
                                        </Fragment>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    <View>
                        <ad.FeedAd adWidth={Device.WIDTH - PxFit(40)} />
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.operation} onPress={hide}>
                            <Text style={styles.operationText}>忽略</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.operation, { borderLeftColor: Theme.lightBorder, borderLeftWidth: 0.5 }]}
                            onPress={() => {
                                hide();
                                if (rewardVideo) {
                                    Tools.navigate('BillingRecord', { initialPage: 1 });
                                } else {
                                    playVideo({ type });
                                }
                            }}>
                            <Text style={[styles.operationText, { color: Theme.theme }]}>
                                {rewardVideo ? '查看' : '领更多奖励'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        width: Device.WIDTH - PxFit(40),
        borderRadius: PxFit(5),
        backgroundColor: Theme.white,
        padding: 0,
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
        width: 62,
        height: 62,
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
        paddingVertical: PxFit(15),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftColor: Theme.lightBorder,
        borderLeftWidth: 0.5,
    },
    operationText: {
        fontSize: PxFit(15),
        fontWeight: '400',
        color: Theme.grey,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },

    title: {
        fontSize: PxFit(18),
        color: Theme.black,
        fontWeight: '600',
    },
});

export default { show, hide };
