import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { PageContainer, Iconfont, CustomTextInput, ListFooter } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, NAVBAR_HEIGHT, Tools } from 'utils';
import { syncGetter } from 'common';
import { app, storage, keys } from '@src/store';
import { useApolloClient, useQuery, GQL } from 'apollo';
import { useNavigation } from 'react-navigation-hooks';
import SearchRecord from './components/SearchRecord';
import CategoryItem from './components/CategoryItem';

const Search = () => {
    const navigation = useNavigation();
    const client = useApolloClient();

    const backButtonPress = useCallback(() => {
        navigation.goBack();
    }, []);

    const [finished, setFinished] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [categories, setCategories] = useState('');
    const [recordData, setRecordData] = useState([]);
    const onChangeText = useCallback(text => {
        setKeyword(text);
    }, []);

    const categoriesQuery = useCallback(() => {
        return client.query({
            query: GQL.SearchCategoriesQuery,
            variables: { limit: 999, keyword },
            fetchPolicy: 'network-only',
        });
    }, [client, keyword]);

    const searchKeyword = useCallback(async () => {
        const [error, result] = await exceptionCapture(categoriesQuery);
        const categoriesData = syncGetter('data.categories', result);

        if (error) {
            //
        } else if (Array.isArray(categoriesData)) {
            setCategories(categoriesData);
        }
    }, [categoriesQuery]);

    const getRecord = useCallback(async () => {
        const record = await storage.getItem(keys.searchRecord);
        if (record) {
            setRecordData(record);
        }
    }, []);

    const removeRecord = useCallback(async () => {
        await storage.removeItem(keys.searchRecord);
        setRecordData([]);
    }, []);

    return (
        <PageContainer hiddenNavBar>
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={1} onPress={backButtonPress} style={styles.backButton}>
                    <Iconfont name="left" color={Theme.primaryTextColor} size={PxFit(21)} />
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrap}>
                        <CustomTextInput
                            value={keyword}
                            placeholder="搜索话题"
                            onChangeText={onChangeText}
                            style={{ flex: 1 }}
                        />
                    </View>
                    <TouchableOpacity style={styles.searchLabel} activeOpacity={0.8} onPress={searchKeyword}>
                        <Iconfont name="search" size={PxFit(20)} color={Theme.subTextColor} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={searchKeyword} style={styles.searchButton}>
                    <Text style={styles.searchText}>搜索</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                {keyword ? (
                    <FlatList
                        data={categories}
                        contentContainerStyle={styles.contentStyle}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={({ item, index }) => <CategoryItem category={item} />}
                        ListFooterComponent={() => <ListFooter finished={true} />}
                    />
                ) : (
                    <SearchRecord data={recordData} remove={removeRecord} />
                )}
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentStyle: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingTop: PxFit(10),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(20),
    },
    header: {
        height: PxFit(NAVBAR_HEIGHT),
        paddingTop: PxFit(Theme.statusBarHeight),
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.navBarSeparatorColor,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: PxFit(50),
        paddingLeft: PxFit(10),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    searchButton: {
        paddingHorizontal: PxFit(10),
        alignSelf: 'stretch',
        justifyContent: 'center',
        textAlign: 'center',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: PxFit(5),
        paddingHorizontal: PxFit(10),
        backgroundColor: Theme.groundColour,
        borderRadius: PxFit(30),
        overflow: 'hidden',
    },
    inputWrap: {
        flex: 1,
        alignSelf: 'stretch',
        borderRightWidth: PxFit(1),
        borderRightColor: Theme.borderColor,
    },
    searchLabel: {
        width: PxFit(30),
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchText: {
        fontSize: PxFit(16),
        color: Theme.secondaryColor,
    },
});

export default Search;
