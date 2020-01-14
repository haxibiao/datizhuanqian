import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, TouchFeedback } from 'components';

import { SCREEN_WIDTH, SCREEN_HEIGHT, ISAndroid } from 'utils';

import WithdrawBody from './components/WithdrawBody';
import NotLogin from './components/NotLogin';
import RuleDescription from './components/RuleDescription';

import { Overlay } from 'teaset';
import { app, observer } from 'store';
import { useDetainment } from 'common';

const index = observer(props => {
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
