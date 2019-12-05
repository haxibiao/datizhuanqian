import React, { useRef, useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { TouchFeedback, CustomRefreshControl } from '@src/components';
import { syncGetter, exceptionCapture } from '@src/common';
import { Config, SCREEN_WIDTH, Theme, PxFit } from '@src/utils';
import { Query, useQuery, GQL } from '@src/apollo';
import { observer, app } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import ListHeader from './components/ListHeader';

const FixedSection = () => {
    const flag = useRef(false);
    const [finished, setFinished] = useState(false);
    const navigation = useNavigation();
    const { name } = navigation.state.params;

    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.ChatsQuery, {
        variables: { limit: 10, filter: name },
    });
    const categories = useMemo(() => syncGetter('categories', data), [data]);

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
                const newCategories = syncGetter('categories', fetchMoreResult);
                flag.current = false;
                if (Array.isArray(newCategories) && newCategories.length > 0) {
                    if (newCategories.length < 10) {
                        setFinished(true);
                    }
                    return Object.assign({}, prev, {
                        categories: [...prev.categories, ...newCategories],
                    });
                }
            },
        });
    }, [categories]);

    return (
        <View>
            <FlatList
                data={categories}
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

export default FixedSection;
