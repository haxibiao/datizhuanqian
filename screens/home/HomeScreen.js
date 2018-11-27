import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from "react-native";

import { Header } from "../../components/Header";
import { DivisionLine, TabTop } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";
import PlateItem from "./PlateItem";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { CategoriesQuery } from "../../graphql/question.graphql";
import { Query } from "react-apollo";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { plate, navigation, user } = this.props;
		console.log("hone", user);
		return (
			<Screen header>
				<Header
					leftComponent={<Text />}
					customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
				/>
				<View style={styles.container}>
					<Query query={CategoriesQuery}>
						{({ data, error, loading, fetch, fetchMore }) => {
							if (error) return null;
							if (!(data && data.categories)) return null;
							return (
								<FlatList
									data={data.categories}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => <PlateItem plate={item} navigation={navigation} />}
									ListHeaderComponent={() => {
										return <TabTop user={user} />;
									}}
								/>
							);
						}}
					</Query>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => {
	return {
		plate: store.question.plate,
		user: store.users.user
	};
})(HomeScreen);
