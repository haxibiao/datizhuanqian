import React, { Component } from "react";
import { Platform } from "react-native";
import RootNavigation from "./navigation/RootNavigation";
import Config from "./constants/Config";
import { connect } from "react-redux";

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

class ApolloApp extends Component {
	_makeClient(user) {
		let { token } = user;
		console.log("user", user);
		this.client = new ApolloClient({
			uri: "https://datizhuanqian.com/graphql",
			request: async operation => {
				operation.setContext({
					headers: {
						token
					}
				});
			},
			cache: new InMemoryCache()
		});
	}

	componentWillMount() {
		let { user = {} } = this.props;
		this.timer = setTimeout(() => {
			this.props.onReady();
		}, 6000);
		console.log("user1", user);
		this._makeClient(user);
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log("user2", nextProps.user);
		if (nextProps.user !== this.props.user) {
			this._makeClient(nextProps.user);
		}
		return false;
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	render() {
		return (
			<ApolloProvider client={this.client}>
				<RootNavigation />
			</ApolloProvider>
		);
	}
}

export default connect(store => {
	return { user: store.users.user };
})(ApolloApp);
