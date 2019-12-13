import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { TouchFeedback, Iconfont, Row } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';
import { observer, app, storage, keys } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';

const SearchRecord = ({ data, remove }) => {
    const navigation = useNavigation();

    const recordList = useMemo(() => {
        return data.map((item, index) => {
            return (
                <TouchableWithoutFeedback
                    key={index}
                    onPress={() => navigation.navigate('Answer', { category: item, question_id: null })}>
                    <View style={styles.categoryItem}>
                        <Text style={styles.categoryName}>搜索历史</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    }, [data]);

    return (
        <View>
            <View style={styles.title}>
                <Text style={styles.titleText}>搜索历史</Text>
                <TouchFeedback style={styles.deleteButton} onPress={remove}>
                    <Iconfont name="trash" color={Theme.subTextColor} size={PxFit(22)} />
                </TouchFeedback>
            </View>
            <View style={styles.categoryWrap}>{recordList}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    deleteButton: {
        paddingVertical: PxFit(5),
        paddingLeft: PxFit(10),
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(Theme.itemSpace),
        paddingTop: PxFit(10),
    },
    titleText: {
        color: Theme.primaryTextColor,
        fontSize: PxFit(15),
        fontWeight: 'bold',
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: PxFit(20),
        marginLeft: PxFit(20),
    },
    categoryItem: {
        alignItems: 'center',
        backgroundColor: Theme.slateGray2,
        borderRadius: PxFit(17),
        flexDirection: 'row',
        height: PxFit(34),
        justifyContent: 'center',
        marginRight: PxFit(20),
        marginBottom: PxFit(10),
        paddingHorizontal: PxFit(12),
    },
    categoryName: {
        color: '#363636',
        fontSize: PxFit(13),
    },
});

export default SearchRecord;
