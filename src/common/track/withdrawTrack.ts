import JAnalytics from 'janalytics-react-native';
import service from 'service';
import { Matomo } from 'native';

/*
 *前面上报事件
 *事件名  动词+名字组合
 *当前前端约定动词   点击、查看、绑定、进入
 */

//提现数据上报
export const withdrawTrack = (props: { withdrawType: any; value: any }) => {
    const { withdrawType, value } = props;

    //极光数据上报
    JAnalytics.postEvent({
        type: 'count',
        id: '1',
        extra: {
            提现方式: withdrawType,
            提现金额: value,
        },
    });

    //matomo 数据上报
    Matomo.trackEvent('提现行为', `点击提现到${withdrawType}`, `点击提现到${withdrawType}`, 1);
    Matomo.trackEvent('提现行为', `点击提现${value}元`, `点击提现${value}元`, 1);
};

//点击绑定微信数据上报
export const bindWeChatTrack = () => {
    JAnalytics.postEvent({
        type: 'count',
        id: '10002',
        extra: {
            绑定事件: '点击微信绑定',
        },
    });

    Matomo.trackEvent('提现行为', `点击微信绑定`, `点击微信绑定`, 1);
};

//绑定微信失败
export const bindWeChatFailedTrack = (props: { error: any }) => {
    const { error } = props;
    JAnalytics.postEvent({
        type: 'count',
        id: '10002',
        extra: {
            绑定事件: '绑定微信失败',
            错误信息: error.toString(),
        },
    });

    Matomo.trackEvent('提现行为', `绑定微信失败`, `绑定微信失败`, 1);
};

//绑定微信成功
export const bindWeChatSucceedTrack = () => {
    JAnalytics.postEvent({
        type: 'count',
        id: '10002',
        extra: {
            绑定事件: '绑定微信成功',
        },
    });

    Matomo.trackEvent('提现行为', `绑定微信成功`, `绑定微信成功`, 1);
};

//绑定支付宝
export const bindAlipayTrack = () => {
    JAnalytics.postEvent({
        type: 'count',
        id: '10002',
        extra: {
            绑定事件: '点击绑定支付宝',
        },
    });

    Matomo.trackEvent('提现行为', `点击支付宝绑定`, `点击支付宝绑定`, 1);
};

//绑定支付宝成功
export const bindAlipaySucceedTrack = () => {
    JAnalytics.postEvent({
        type: 'count',
        id: '10002',
        extra: {
            绑定事件: '绑定支付宝成功',
        },
    });

    Matomo.trackEvent('提现行为', `绑定支付宝成功`, `绑定支付宝成功`, 1);
};

//绑定支付宝失败
export const bindAlipayFailedTrack = (props: { error: any }) => {
    const { error } = props;
    JAnalytics.postEvent({
        type: 'count',
        id: '10002',
        extra: {
            绑定事件: '绑定支付宝失败',
            错误信息: error.toString(),
        },
    });

    Matomo.trackEvent('提现行为', `绑定支付宝失败`, `绑定支付宝失败`, 1);
};
