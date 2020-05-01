import React from 'react';
import { PageContainer } from 'components';

import WithdrawBody from './components/WithdrawBody';
import NotLogin from './components/NotLogin';

import { app, observer } from 'store';
import { useDetainment } from 'common';

import { makeWithdrawClient } from '@src/apollo/withdrawClient';

const index = observer((props: { navigation: any }) => {
    const { navigation } = props;
    const { login } = app;

    const withdrawClient = makeWithdrawClient(app.me); // 构建apollo client;
    console.log('withdrawClient :', withdrawClient);
    return (
        <PageContainer hiddenNavBar>
            {login ? (
                <WithdrawBody navigation={navigation} withdrawClient={withdrawClient} />
            ) : (
                <NotLogin navigation={navigation} />
            )}
        </PageContainer>
    );
});

export default index;
