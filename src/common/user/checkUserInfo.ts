import TipsOverlay from '../../components/Overlay/TipsOverlay';
import { app } from 'store';
import { GQL } from 'apollo';
import { Tools, ISIOS } from 'utils';

interface User {
    auto_uuid_user: boolean;
    auto_phone_user: boolean;
    account: string;
}

export function checkUserInfo() {
    app.client
        .mutate({
            mutation: GQL.UserAutoQuery,
            variables: {
                id: app.me.id,
            },
        })
        .then((result: { data: { user: any } }) => {
            const { user } = result.data;
            checkLoginInfo(user);
        })
        .catch((error: any) => {
            Toast.show({
                content: '获取账号信息失败，请检查网络',
            });
        });
}

function checkLoginInfo(user: User) {
    const { auto_uuid_user, auto_phone_user, account } = user;

    if (auto_uuid_user || auto_phone_user) {
        TipsOverlay.show({
            title: '您还未完善登录信息',
            content: '完善登录信息后即可绑定支付宝',
            onConfirm: () => Tools.navigate('SetLoginInfo', { phone: auto_phone_user ? account : null }),
            confirmContent: '去完善',
        });
    } else {
        Tools.navigate(ISIOS ? 'ModifyAliPay' : 'SettingWithdrawInfo');
    }
}
