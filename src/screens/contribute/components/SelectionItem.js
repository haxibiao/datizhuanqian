/*
 * @flow
 * created by wyk made in 2019-02-14 11:36:47
 */
'use strict';

import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { CustomTextInput } from '@src/components';
import { observer } from '../store';

export default observer(props => {
    const { style, item, onChange, onCheck } = props;
    return (
        <View style={[styles.selectionItem, style]}>
            <View style={styles.selectionText}>
                <Text style={styles.valueText}>{item.Value}.</Text>
                <CustomTextInput
                    style={styles.textInput}
                    value={item.Text}
                    onChangeText={onChange}
                    maxLength={100}
                    placeholder="输入题目选项"
                />
            </View>
            <TouchableOpacity style={styles.checkItem} onPress={onCheck}>
                <Image
                    style={styles.checkIcon}
                    source={
                        item.isCorrect
                            ? require('@src/assets/images/check-square.png')
                            : require('@src/assets/images/check-square-none.png')
                    }
                />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    selectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectionText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: PxFit(40),
        borderRadius: PxFit(5),
        paddingHorizontal: PxFit(10),
        backgroundColor: '#f4f4f4',
    },
    valueText: {
        fontSize: PxFit(17),
        fontWeight: 'bold',
        color: '#202020',
        lineHeight: PxFit(20),
    },
    textInput: {
        flex: 1,
        alignSelf: 'stretch',
        marginLeft: PxFit(4),
        fontSize: PxFit(14),
        lineHeight: PxFit(20),
    },
    checkItem: {
        height: PxFit(40),
        paddingHorizontal: PxFit(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        width: PxFit(20),
        height: PxFit(20),
        resizeMode: 'cover',
    },
});
