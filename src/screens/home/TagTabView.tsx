import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer, app, storage, keys } from '@src/store';
import { useQuery, GQL } from '@src/apollo';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TagList from './TagList';
import TagsPlaceholder from './components/TagsPlaceholder';
import ScrollableTabBar from './components/ScrollableTabBar';

const TagTabView = () => {
    const [tags, setTags] = useState([]);

    const TagsQuery = useCallback(() => {
        return app.client.query({
            query: GQL.TagsQuery,
            variables: {
                filter: 'HOMEPAGE',
            },
            fetchPolicy: 'network-only',
        });
    }, [app.client]);

    const getTags = useCallback(tagsData => {
        setTags(tagsData);
    }, []);

    const fetchData = useCallback(async () => {
        const [error, result] = await Helper.exceptionCapture(TagsQuery);
        // console.log('result :', result, error);
        const systemConfig = Helper.syncGetter('data.systemConfig', result);
        // setSystemConfig(Helper.syncGetter('data.systemConfig', result));
        // return systemConfig;
        const tagsData = Helper.syncGetter('data.tags', result);
        getTags(tagsData);
    }, [TagsQuery]);

    useEffect(() => {
        fetchData();
    }, []);

    // const { data, error, loading, refetch } = useQuery(GQL.TagsQuery, {
    //     variables: {
    //         filter: 'HOMEPAGE',
    //     },
    // });

    // const tagsData = useMemo(() => {
    //     if (tags.length > 0) {
    //         return tags;
    //     } else if (app.tagsCache) {
    //         return app.tagsCache;
    //     }
    //     return [];
    // }, [tags.length]);
    console.log('tags :>> ', tags);
    if (tags && tags.length > 0) {
        return (
            <ScrollableTabView
                prerenderingSiblingsNumber={0}
                renderTabBar={() => <ScrollableTabBar {...scrollTabStyle} />}>
                {tags.map(tag => {
                    return <TagList key={tag.id} tabLabel={tag.name} tag={tag} />;
                })}
            </ScrollableTabView>
        );
    } else {
        return <TagsPlaceholder contentStyle={styles.placeholderStyle} />;
    }

    return null;
};

const scrollTabStyle = {
    style: {
        height: 51,
        borderColor: '#F6F6F6',
    },
    tabStyle: {
        height: 50,
        paddingLeft: 2,
        paddingRight: 2,
        bottom: -5,
    },
    activeTextStyle: {
        fontSize: Font(20),
        fontWeight: 'bold',
        color: Theme.defaultTextColor,
    },
    inactiveTextStyle: {
        color: Theme.defaultTextColor,
    },
    textStyle: {
        fontSize: Font(16),
    },
    underlineStyle: {
        height: PxFit(8),
        borderRadius: PxFit(4),
        // width:PxFit(40),
        backgroundColor: '#FECE4D',
    },
};

const styles = StyleSheet.create({
    placeholderStyle: {
        marginHorizontal: PxFit(Theme.itemSpace),
        paddingBottom: Device.HOME_INDICATOR_HEIGHT + PxFit(56),
    },
});

export default TagTabView;
