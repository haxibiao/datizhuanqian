import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { PxFit } from 'utils';

const Footer = props => {
    return useMemo(
        () => (
            <View style={styles.footer}>
                <ActivityIndicator color="#fff" size={'small'} />
            </View>
        ),
        [],
    );
};

const styles = StyleSheet.create({
    footer: {
        alignItems: 'center',
        paddingVertical: PxFit(10),
    },
    image: {
        width: PxFit(60),
        height: PxFit(60),
    },
});

export default Footer;
