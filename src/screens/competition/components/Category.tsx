import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

const Category = props => {
    const { category, navigation } = props;
    if (!category) {
        return (
            <View style={styles.container}>
                <View style={styles.cover} />
                <View style={styles.shadow} />
            </View>
        );
    }
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Matching', { category })} style={styles.container}>
            <View>
                <Image source={{ uri: category.icon }} style={styles.cover} />
                <View style={styles.shadow} />
            </View>
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>
                    {category.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { width: (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 4) / 3 },
    content: {
        marginTop: PxFit(6),
    },
    cover: {
        borderRadius: PxFit(5),
        height: (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 4) / 3,
        width: (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 4) / 3,
    },
    name: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
        lineHeight: PxFit(22),
    },
    shadow: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: PxFit(5),
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
});

export default Category;
