import React, { useRef, useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { CustomRefreshControl, ListFooter } from '@src/components';
import { syncGetter } from '@src/common';
import { SCREEN_WIDTH, Theme, PxFit } from '@src/utils';
import { useQuery, GQL } from '@src/apollo';
import { observer, app } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import TagsPlaceholder from './components/TagsPlaceholder';
import ListHeader from './components/ListHeader';
import TagItem from './components/TagItem';

const TagList = props => {
    const { tag } = props;
    const flag = useRef(false);
    const [finished, setFinished] = useState(false);
    const navigation = useNavigation();

    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.TagCategoriesQuery, {
        variables: { limit: 10, id: tag.id },
    });
    const categories = useMemo(() => syncGetter('tag.categories', data), [data]);

    const onEndReached = useCallback(async () => {
        if (flag.current) {
            return;
        }
        flag.current = true;
        fetchMore({
            variables: {
                offset: categories.length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                const newCategories = syncGetter('tag.categories', fetchMoreResult);
                flag.current = false;
                if (Array.isArray(newCategories)) {
                    if (newCategories.length === 0) {
                        setFinished(true);
                        return prev;
                    }
                    if (newCategories.length < 10) {
                        setFinished(true);
                    }
                    return Object.assign({}, prev, {
                        tag: Object.assign({}, prev.tag, {
                            categories: [...prev.tag.categories, ...newCategories],
                        }),
                    });
                } else {
                    return prev;
                }
            },
        });
    }, [categories]);

    const keyExtractor = useCallback((item, index) => {
        return item.id ? item.id.toString() : index.toString();
    }, []);

    const renderItem = useCallback(({ item }) => {
        return <TagItem title={item.name} category={item} />;
    }, []);

    return (
        <FlatList
            contentContainerStyle={styles.contentStyle}
            data={categories}
            refreshControl={
                <CustomRefreshControl refreshing={loading} onRefresh={refetch} reset={() => setFinished(false)} />
            }
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={() => <TagsPlaceholder isTab />}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            ListHeaderComponent={() => <ListHeader navigation={navigation} />}
            ListFooterComponent={() => <ListFooter finished={finished} />}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    contentStyle: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(56),
        paddingHorizontal: PxFit(Theme.itemSpace),
        backgroundColor: '#F6F6F6',
    },
    itemSeparator: {
        height: PxFit(Theme.itemSpace),
    },
});

export default TagList;
