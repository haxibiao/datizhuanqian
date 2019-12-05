import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import CategoryItem from './CategoryItem';

const SectionItem = ({ category }) => {
    const categories = useMemo(() => category.children, []);

    const keyExtractor = useCallback((item, index) => {
        return item.id ? item.id.toString() + Date.now() : index.toString();
    }, []);

    if (Array.isArray(categories) && categories.length > 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <FlatList
                    data={categories}
                    numColumns={3}
                    renderItem={({ item }) => <CategoryItem category={item} hasSibling={true} />}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                    keyExtractor={keyExtractor}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    columnWrapperStyle={styles.columnStyle}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CategoryItem category={category} />
        </View>
    );
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
    columnStyle: {
        justifyContent: 'space-between',
        marginTop: PxFit(Theme.itemSpace),
    },
    itemSeparator: {
        height: PxFit(Theme.itemSpace),
    },
});

export default SectionItem;
