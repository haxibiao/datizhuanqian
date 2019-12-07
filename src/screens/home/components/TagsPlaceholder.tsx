import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Row, Placeholder } from 'components';
import { Config, SCREEN_WIDTH, Theme, PxFit } from 'utils';

const TagsPlaceholder = ({ contentStyle = {}, isTab }) => {
    return (
        <View style={styles.container}>
            {!isTab && (
                <>
                    <View style={styles.tab} />
                    <Row style={styles.enters}>
                        <View style={[styles.entrance, { marginRight: PxFit(10) }]} />
                        <View style={styles.entrance} />
                    </Row>
                </>
            )}
            <View style={contentStyle}>
                <View style={styles.list}>
                    {Array(3)
                        .fill(0)
                        .map((elem, index) => {
                            return <Placeholder key={index} type="list" />;
                        })}
                </View>
                <View style={styles.list}>
                    <Placeholder type="list" />
                </View>
            </View>
        </View>
    );
};

const entranceWidth = (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2 - PxFit(10)) / 2;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F6F6F6',
    },
    tab: {
        height: 41,
        backgroundColor: '#e9e9e9',
    },
    enters: {
        margin: PxFit(Theme.itemSpace),
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
    },
    entrance: {
        width: entranceWidth,
        height: (entranceWidth * 228) / 505,
        borderRadius: PxFit(5),
        backgroundColor: '#e9e9e9',
    },
    list: {
        padding: PxFit(12),
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
        marginBottom: PxFit(Theme.itemSpace),
    },
});

export default TagsPlaceholder;
