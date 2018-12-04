import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import Colors from "../../constants/Colors";

import LoadingError from "./LoadingError";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true });
		console.log("error");
	}

	render() {
		if (this.state.hasError) {
			return <LoadingError />;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
