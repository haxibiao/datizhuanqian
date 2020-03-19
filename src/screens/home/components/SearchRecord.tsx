import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { TouchFeedback, Iconfont } from 'components';

const SearchRecord = ({ data, remove, search }) => {
    const recordList = useMemo(() => {
        if (Array.isArray(data)) {
            return data.map(name => {
                return (
                    <TouchableWithoutFeedback key={name} onPress={() => search(name)}>
                        <View style={styles.categoryItem}>
                            <Text style={styles.categoryName}>{name}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                );
            });
        }
    }, [data]);

    return (
        <View>
            <View style={styles.title}>
                <Text style={styles.titleText}>搜索历史</Text>
                <TouchFeedback style={styles.deleteButton} onPress={remove}>
                    <Iconfont name="trash" color={Theme.subTextColor} size={PxFit(20)} />
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
        marginTop: PxFit(5),
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    titleText: {
        color: Theme.primaryTextColor,
        fontSize: PxFit(14),
        fontWeight: 'bold',
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: PxFit(10),
        marginLeft: PxFit(20),
    },
    categoryItem: {
        alignItems: 'center',
        backgroundColor: Theme.groundColour,
        borderRadius: PxFit(14),
        flexDirection: 'row',
        height: PxFit(28),
        minWidth: PxFit(44),
        justifyContent: 'center',
        marginRight: PxFit(20),
        marginBottom: PxFit(10),
        paddingHorizontal: PxFit(10),
    },
    categoryName: {
        color: '#363636',
        fontSize: PxFit(13),
    },
});

export default SearchRecord;
