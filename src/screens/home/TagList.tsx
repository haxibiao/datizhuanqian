import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { CustomRefreshControl, ListFooter } from '@src/components';
import { useQuery, GQL } from '@src/apollo';
import { observer, app } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import TagsPlaceholder from './components/TagsPlaceholder';
import ListHeader from './components/ListHeader';
import TagItem from './components/TagItem';
import CustomTag from './components/CustomTag';
import GuestLikeCategories from './components/GuestLikeCategories';
import NewestCategories from './components/NewestCategories';
import RecommendCategories from './components/RecommendCategories';

const TagList = observer(props => {
    const { tag } = props;
    const flag = useRef(false);
    const hasMoreTags = useRef(true);
    const [finished, setFinished] = useState(false);
    const navigation = useNavigation();

    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.TagQuery, {
        variables: { limit: 10, id: tag.id },
    });
    console.log('data :>> ', data);
    const tags = useMemo(() => {
        const tagsData = Helper.syncGetter('tag.tags', data);

        if (Array.isArray(tagsData)) {
            return tagsData;
        }

        return [];
    }, [data]);

    const categories = useMemo(() => {
        const categoriesData = Helper.syncGetter('tag.categories', data);
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
        } else if ((loading || error) && app.tagListData[tag.id]) {
            return app.tagListData[tag.id];
        } else {
            return [];
        }
    }, [tags, categories, tag, error, loading, app.tagListData]);

    useEffect(() => {
        if (listData && listData.length > 0) {
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
                // tagsOffset: tags.length,
                categoriesOffset: categories.length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                // const newTags = Array.isArray(Helper.syncGetter('tag.tags', fetchMoreResult))
                //     ? Helper.syncGetter('tag.tags', fetchMoreResult)
                //     : [];
                const newCategories = Array.isArray(Helper.syncGetter('tag.categories', fetchMoreResult))
                    ? Helper.syncGetter('tag.categories', fetchMoreResult)
                    : [];
                flag.current = false;

                if (newCategories.length > 0) {
                    if (newCategories.length < 10) {
                        setFinished(true);
                    }
                    return Object.assign({}, prev, {
                        tag: Object.assign({}, prev.tag, {
                            // tags: [...prev.tag.tags, ...newTags],
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
        return tag.id == 10 ? (
            <CustomTag tag={tag} title={item.name} {...props} />
        ) : (
            <TagItem tag={tag} title={item.name} {...props} />
        );
    }, []);
    console.log('listData :', listData);

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
            ListHeaderComponent={() => (
                <View>
                    <ListHeader navigation={navigation} />
                </View>
            )}
            ListFooterComponent={() => <ListFooter finished={finished} />}
            showsVerticalScrollIndicator={false}
        />
    );
});

const styles = StyleSheet.create({
    contentStyle: {
        flexGrow: 1,
        paddingBottom: Device.HOME_INDICATOR_HEIGHT + PxFit(56),
        paddingHorizontal: PxFit(Theme.itemSpace),
        backgroundColor: '#FFF',
    },
    itemSeparator: {
        height: PxFit(Theme.itemSpace),
    },
});

export default TagList;
