import JAnalytics from 'janalytics-react-native';
import service from 'service';

//提现数据上报
export const withdrawTrack = (props: { withdrawType: any; value: any }) => {
    const { withdrawType, value } = props;
    console.log('value', value);
    JAnalytics.postEvent({
        type: 'count',
        id: '1',
        extra: {
            提现方式: withdrawType,
            提现金额: value,
        },
    });

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_withdraw_type',
            name: `用户提现到${withdrawType}`,
        },
    });

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_withdraw_count',
            name: `用户提现${value}元`,
        },
    });
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

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_bind_wechat',
            name: `用户点击微信绑定`,
        },
    });
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

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_bind_wechat_failed',
            name: `用户微信绑定失败`,
        },
    });
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

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_bind_wechat_succeed',
            name: `用户微信绑定成功`,
        },
    });
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

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_bind_alipay',
            name: `用户点击支付宝绑定`,
        },
    });
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

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_bind_wechat_succeed',
            name: `用户支付宝绑定成功`,
        },
    });
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

    service.dataReport({
        data: {
            category: '用户行为',
            action: 'user_click_bind_wechat_failed',
            name: `用户支付宝绑定失败`,
        },
    });
};
