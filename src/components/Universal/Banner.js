import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Linking } from "react-native";
import Swiper from "react-native-swiper";

import DivisionLine from "./DivisionLine";

import Colors from "../../constants/Colors";
import { BannersQuery } from "../../graphql/question.graphql";
import { Query } from "react-apollo";

const { width, height } = Dimensions.get("window");

class Banner extends Component {
	constructor(props) {
		super(props);
		this.openUrl = this.openUrl.bind(this);
		this.state = {};
	}
	openUrl(url) {
		console.log("uri", url);
		Linking.openURL(url);
	}

	render() {
		let { navigation } = this.props;
		return (
			<Query query={BannersQuery}>
				{({ data, loading, error }) => {
					if (error) return null;
					if (!(data && data.banners)) return null;
					if (data.banners.length < 1) return null;
					return (
						<Swiper
							autoplay={true}
							autoplayTimeout={5}
							paginationStyle={{ bottom: 10 }}
							activeDotColor="#fff"
							showsPagination={false}
							height={74}
						>
							{data.banners.map((banner, index) => {
								return (
									<TouchableOpacity onPress={() => this.openUrl(banner.url)} key={index}>
										<Image
											source={{
												uri: banner.image
											}}
											style={styles.img}
											key={index}
										/>
									</TouchableOpacity>
								);
							})}
						</Swiper>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 74,
		alignItems: "center",
		justifyContent: "center"
	},
	img: {
		width,
		height: 70,
		resizeMode: "cover"
	}
});

export default Banner;
