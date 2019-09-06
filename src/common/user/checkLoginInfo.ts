import TipsOverlay from '../../components/Overlay/TipsOverlay';

export function checkLoginInfo(auto_uuid_user?: boolean, auto_phone_user?: boolean, navigation?: any) {
    if (auto_uuid_user || auto_phone_user) {
        TipsOverlay.show({
            title: '您还未完善登录信息',
            content: '完善登录信息后即可绑定支付宝',
            onConfirm: () => navigation.navigate('SetLoginInfo', { phone: null }),
            confirmContent: '去完善',
        });
    } else {
        navigation.navigate('ModifyAliPay');
    }
}
