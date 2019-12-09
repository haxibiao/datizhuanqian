import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
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
    const hasMoreTags = useRef(true);
    const [finished, setFinished] = useState(false);
    const navigation = useNavigation();

    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.TagQuery, {
        variables: { limit: 10, id: tag.id },
    });

    const tags = useMemo(() => {
        const tagsData = syncGetter('tag.tags', data);
        if (Array.isArray(tagsData)) {
            return tagsData;
        }
        return [];
    }, [data]);

    const categories = useMemo(() => {
        const categoriesData = syncGetter('tag.categories', data);
        if (Array.isArray(categoriesData)) {
            return categoriesData;
        }
        return [];
    }, [data]);

    const listData = useMemo(() => {
        if (tags.length > 0) {
            if (tags.length % 10 === 0 && hasMoreTags.current) {
                return tags;
            } else if (categories.length > 0) {
                return tags.concat(categories);
            }
        } else if (categories.length > 0) {
            return categories;
        } else if ((!loading || error) && app.tagListData[tag.id]) {
            return app.tagListData[tag.id];
        } else {
            return [];
        }
    }, [tags, categories, tag, error, loading]);

    useEffect(() => {
        if (listData.length > 0) {
            app.updateTagListCache(tag.id, listData);
        }
    }, [listData]);

    const onEndReached = useCallback(async () => {
        if (flag.current || finished) {
            return;
        }
        flag.current = true;
        fetchMore({
            variables: {
                tagsOffset: tags.length,
                categoriesOffset: categories.length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                const newTags = Array.isArray(syncGetter('tag.tags', fetchMoreResult))
                    ? syncGetter('tag.tags', fetchMoreResult)
                    : [];
                const newCategories = Array.isArray(syncGetter('tag.categories', fetchMoreResult))
                    ? syncGetter('tag.categories', fetchMoreResult)
                    : [];
                flag.current = false;

                if (newTags.length > 0 || newCategories.length > 0) {
                    if (newTags.length < 10) {
                        hasMoreTags.current = false;
                    }
                    if (newTags.length < 10 && newCategories.length < 10) {
                        setFinished(true);
                    }
                    return Object.assign({}, prev, {
                        tag: Object.assign({}, prev.tag, {
                            tags: [...prev.tag.tags, ...newTags],
                            categories: [...prev.tag.categories, ...newCategories],
                        }),
                    });
                } else {
                    hasMoreTags.current = false;
                    setFinished(true);
                    return prev;
                }
            },
        });
    }, [finished, tags, categories]);

    const keyExtractor = useCallback((item, index) => {
        return item.id ? item.id.toString() : index.toString();
    }, []);

    const renderItem = useCallback(({ item }) => {
        let props;
        if (item.categories) {
            props = { data: item.categories };
        } else {
            props = { category: item };
        }
        return <TagItem title={item.name} {...props} />;
    }, []);

    return (
        <FlatList
            contentContainerStyle={styles.contentStyle}
            data={listData}
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
