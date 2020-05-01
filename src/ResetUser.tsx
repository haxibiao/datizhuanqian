import React, { useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { observer, app, storage, keys } from '@src/store';
import { useQuery, GQL } from '@src/apollo';

const ResetUser = () => {
    // 每个版本静默重新登录一次
    const resetUser = useCallback(async () => {
        const resetVersion = await storage.getItem(keys.resetVersion);
        const me = (await storage.getItem(keys.me)) || (await storage.getItem(keys.user));

        if (resetVersion !== Config.Version && me) {
            app.client
                .mutate({
                    mutation: GQL.signToken,
                    variables: {
                        token: me.token,
                    },
                })
                .then(result => {
                    app.signIn(result.data.signInWithToken);
                    app.updateResetVersion(Config.Version);
                    app.updateUserCache(result.data.signInWithToken);
                });
        }
    }, [app.client]);

    useEffect(() => {
        resetUser();
    }, [app.login]);
    // console.log('app :>> ', app);
    return null;
};

export default ResetUser;
