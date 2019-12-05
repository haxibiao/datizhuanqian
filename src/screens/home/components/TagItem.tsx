import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import PlateItem from './PlateItem';

const TagItem = ({ title, categories }) => {
    const keyExtractor = useCallback((item, index) => {
        return item.id ? item.id.toString() + Date.now() : index.toString();
    }, []);

    if (!Array.isArray(categories)) {
        return <View />;
    } else if (categories.length > 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <FlatList
                    data={categories}
                    renderItem={({ item }) => <PlateItem category={item} />}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                    keyExtractor={keyExtractor}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    } else if (categories.length === 1) {
        <View style={styles.container}>
            <CategoryItem category={category} />
        </View>;
    }
};

const styles = StyleSheet.create({
    container: {
        padding: PxFit(Theme.itemSpace),
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
        fontWeight: 'bold',
        marginBottom: PxFit(Theme.itemSpace),
    },
    itemSeparator: {
        height: PxFit(1),
        backgroundColor: '#f0f0f0',
    },
});

export default TagItem;
