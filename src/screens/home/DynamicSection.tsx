import React, { useRef, useMemo, useState, useCallback } from 'react';
import { View, Text, SectionList } from 'react-native';
import { TouchFeedback, CustomRefreshControl } from '@src/components';
import { syncGetter, exceptionCapture } from '@src/common';
import { Config, SCREEN_WIDTH, Theme, PxFit } from '@src/utils';
import { Query, useQuery, GQL } from '@src/apollo';
import { observer, app } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import ListHeader from './components/ListHeader';

const DynamicSection = () => {
    const flag = useRef(false);
    const [finished, setFinished] = useState(false);
    const navigation = useNavigation();
    const { name } = navigation.state.params;

    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.ChatsQuery, {
        variables: { limit: 10, filter: name },
    });

    const tags = useMemo(() => {
        const res = syncGetter('tags', data);
        return res.map(item => {
            return { title: item.name, data: item.categories };
        });
    }, [data]);

    const onEndReached = useCallback(async () => {
        if (flag.current) {
            return;
        }
        flag.current = true;
        fetchMore({
            variables: {
                offset: tags.length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                const newTags = syncGetter('tags', fetchMoreResult);
                flag.current = false;
                if (Array.isArray(newTags) && newTags.length > 0) {
                    if (newTags.length < 10) {
                        setFinished(true);
                    }
                    return Object.assign({}, prev, {
                        tags: [...prev.tags, ...newTags],
                    });
                }
            },
        });
    }, [tags]);

    return (
        <View>
            <SectionList
                data={tags}
                refreshControl={
                    <CustomRefreshControl refreshing={loading} onRefresh={refetch} reset={() => setFinished(false)} />
                }
                keyExtractor={(item, index) => (item.id ? item.id.toString() + Date.now() : index.toString())}
                renderItem={({ item, index }) => <View category={item} />}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.2}
                ListHeaderComponent={() => <ListHeader navigation={navigation} />}
                ListFooterComponent={() => <ListFooter finished={finished} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default DynamicSection;
