import React, { Component, useState } from 'react';
import { View, Image, PixelRatio } from 'react-native';
import { Theme, PxFit } from '../../utils';

import { app } from 'store';
import { GQL } from 'apollo';

const Avatar = props => {
    const [loading, setlLoading] = useState(true);

    const onError = () => {
        setlLoading(false);
        app.client
            .mutate({
                mutation: GQL.FixUserAvatarMutation,
                variables: {
                    user_id: props.userId || app.me.id,
                },
            })
            .then(data => {
                console.log('data :', data);
            })
            .catch(err => {
                console.log('err :', err);
            });
    };

    const { size, style } = props;
    let { source } = props;
    const avatar = {
        width: size || PxFit(44),
        height: size || PxFit(44),
        borderRadius: PixelRatio.roundToNearestPixel((size || PxFit(44)) / 2),
        backgroundColor: '#f9f9f9',
    };
    if (typeof source === 'string') {
        source = { uri: source };
    }
    return (
        <Image
            source={loading ? source : 'http://cos.datizhuanqian.com/storage/app/avatars/avatar.png'}
            resizeMode="cover"
            style={[avatar, style]}
            onError={onError}
        />
    );
};

export default Avatar;
