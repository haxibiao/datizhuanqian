import React from 'react';
import { PageContainer } from 'components';

import WithdrawBody from './components/WithdrawBody';
import NotLogin from './components/NotLogin';

import { app, observer } from 'store';
import { useDetainment } from 'common';

const index = observer((props: { navigation: any }) => {
    const { navigation } = props;
    const { login } = app;

    useDetainment(navigation);

    return (
        <PageContainer hiddenNavBar>
            {login ? <WithdrawBody navigation={navigation} /> : <NotLogin navigation={navigation} />}
        </PageContainer>
    );
});

export default index;
