import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Theme, PxFit } from 'utils';
import { Iconfont } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import CategoryItem from './CategoryItem';

const TagItem = ({ category, data, title, tag }) => {
    const navigation = useNavigation();

    const categories = useMemo(() => {
        if (Array.isArray(data) && data.length > 0) {
            return data;
        } else if (category && Array.isArray(category.children) && category.children.length > 0) {
            return [category, ...category.children];
        }
    }, []);

    const keyExtractor = useCallback((item, index) => {
        return item.id ? item.id.toString() : index.toString();
    }, []);

    if (categories) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.titleWrap}>
                        <Image source={require('@src/assets/images/category_tag.png')} style={styles.tagImage} />
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>
                    {categories.length > 3 && (
                        <TouchableOpacity
                            style={styles.moreCategory}
                            activeOpacity={1}
                            onPress={() =>
                                navigation.navigate('MoreCategories', {
                                    categories,
                                    title,
                                    tag,
                                })
                            }>
                            <Text style={styles.moreCategoryText}>更多</Text>
                            <Iconfont name="right" color={Theme.correctColor} size={PxFit(14)} />
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    data={categories.slice(0, 3)}
                    renderItem={({ item }) => <CategoryItem tag={tag} category={item} />}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    } else if (category) {
        return (
            <View style={styles.container}>
                <CategoryItem tag={tag} category={category} />
            </View>
        );
    } else {
        return null;
    }
};

const styles = StyleSheet.create({
    container: {
        padding: PxFit(12),
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: PxFit(12),
        marginBottom: PxFit(Theme.itemSpace),
        borderBottomWidth: PxFit(1),
        borderColor: Theme.borderColor,
    },
    titleWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PxFit(Theme.itemSpace),
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(15),
        fontWeight: 'bold',
        lineHeight: PxFit(20),
    },
    tagImage: {
        height: PxFit(18),
        width: PxFit(18),
        marginRight: PxFit(3),
    },
    columnStyle: {
        justifyContent: 'space-between',
        marginTop: PxFit(Theme.itemSpace),
    },
    moreCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        height: PxFit(20),
        paddingLeft: PxFit(10),
    },
    moreCategoryText: {
        color: Theme.correctColor,
        fontSize: PxFit(14),
        marginRight: PxFit(2),
    },
    itemSeparator: {
        height: PxFit(Theme.itemSpace) * 2,
    },
});

export default TagItem;
