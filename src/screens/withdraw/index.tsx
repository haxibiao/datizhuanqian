import React from 'react';
import { PageContainer } from 'components';

import WithdrawBody from './components/WithdrawBody';
import NotLogin from './components/NotLogin';

import { app, observer } from 'store';
import { useDetainment } from 'common';

import { makeMutationClient } from '@src/apollo/mutationClient';

const index = observer((props: { navigation: any }) => {
    const { navigation } = props;
    const { login } = app;

    useDetainment(navigation);

    const mutationClient = makeMutationClient(app.me); // 构建apollo client;
    console.log('mutationClient :', mutationClient);
    return (
        <PageContainer hiddenNavBar>
            {login ? (
                <WithdrawBody navigation={navigation} mutationClient={mutationClient} />
            ) : (
                <NotLogin navigation={navigation} />
            )}
        </PageContainer>
    );
});

export default index;
