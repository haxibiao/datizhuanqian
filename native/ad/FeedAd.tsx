/* eslint-disable handle-callback-err */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');
import { PxFit, Theme, ISIOS, Tools } from 'utils';
import { SCREEN_WIDTH } from 'utils';
import { config, app } from 'store';

// import { GQL } from 'apollo';
import { GQL } from 'gqls';

import service from 'service';

const NativeFeedAd = requireNativeComponent('FeedAd');

import { CodeIdFeed, CodeIdFeedIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdFeedIOS : CodeIdFeed;
interface Props {
    adWidth: number;
    onAdClick?: Function;
    onCloseAd?: Function;
    onAdShow?: Function;
    onError?: Function;
}

const FeedAd = (props: Props) => {
    let { adWidth = width - 30, onError, onAdShow, onCloseAd, onAdClick } = props;
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(0); //默认高度
    const disableAd = config.disableAd;

    const clickAd = () => {
        app.client
            .mutate({
                mutation: GQL.UserRewardMutation,
                variables: {
                    reward: 'CLICK_DRAW_FEED',
                },
                refetchQueries: () => [
                    {
                        query: GQL.UserMetaQuery,
                        variables: { id: app.me.id },
                    },
                ],
            })
            .then((data: any) => {
                const contribute = Tools.syncGetter('data.userReward.contribute', data);
                Toast.show({
                    content: `恭喜你获得+${contribute}贡献值`,
                    duration: 2000,
                    layout: 'bottom',
                });
            })
            .catch((err: any) => {
                Toast.show({
                    content: '遇到未知错误，领取失败',
                });
            });
        service.dataReport({
            data: { category: '广告点击', action: 'user_click_feed_ad', name: '用户点击Feed广告' },
            callback: (result: any) => {
                console.warn('result', result);
            },
        }); // 上报Feed
    };

    console.log('disableAd :', disableAd, visible, GQL);
    if (!visible || disableAd) {
        return null;
    }
    return (
        <NativeFeedAd
            codeid={codeid}
            // provider={'百度'}
            // codeid={'6804265'}

            // provider={'腾讯'}
            // codeid={'6020790561090327'}

            adWidth={adWidth}
            style={{ width: adWidth, height }}
            onAdClick={(e: { nativeEvent: any }) => {
                clickAd();
                setTimeout(() => {
                    setVisible(false);
                }, 1000);
                onAdClick && onAdClick(e.nativeEvent);
            }}
            onError={(e: { nativeEvent: any }) => {
                console.log('onError', e.nativeEvent);
                onError && onError(e.nativeEvent);
                setVisible(false);
            }}
            onCloseAd={(e: { nativeEvent: any }) => {
                console.log('onCloseAd', e.nativeEvent);
                onCloseAd && onCloseAd(e.nativeEvent);
                setVisible(false);
            }}
            onLayoutChanged={(e: { nativeEvent: { height: React.SetStateAction<number> } }) => {
                console.log('onLayoutChanged', e.nativeEvent);
                if (e.nativeEvent.height) {
                    setHeight(e.nativeEvent.height);
                    onAdShow && onAdShow(e.nativeEvent);
                } else {
                    setVisible(false);
                }
            }}
        />
    );
};

export default FeedAd;
