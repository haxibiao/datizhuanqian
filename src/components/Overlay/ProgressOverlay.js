/*
 * @flow
 * created by wyk made in 2019-01-14 14:51:21
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { Overlay } from 'teaset';
import { Theme, PxFit, Tools } from '../../utils';

type Props = {
	message: ?string
};
type State = {
	progress: number
};
class TransferProgress extends Component<Props, State> {
	state = {
		progress: 0
	};
	render() {
		let { message, type } = this.props;
		return (
			<View style={styles.progress}>
				{type == 'progress' ? (
					<Progress.Circle
						size={46}
						progress={this.state.progress / 100}
						color="#6E71F2"
						unfilledColor={'#fff'}
						borderColor="rgba(255,255,255,0)"
						showsText
					/>
				) : (
					<ActivityIndicator color="#fff" size={'small'} />
				)}
				{message && <Text style={styles.message}>{message}</Text>}
			</View>
		);
	}
}

class ProgressOverlay {
	static show(message?: string, type: 'progress' | 'waiting' = 'progress') {
		let overlayView = (
			<Overlay.View modal animated style={{ alignItems: 'center', justifyContent: 'center' }}>
				<TransferProgress ref={ref => (this.progressRef = ref)} message={message} type={type} />
			</Overlay.View>
		);
		this.overlayKey = Overlay.show(overlayView);
	}

	static progress(progress: number) {
		console.log('progress', progress);
		this.progressRef.setState({ progress });
	}

	static hide() {
		if (this.overlayKey) {
			Overlay.hide(this.overlayKey);
			this.overlayKey = null;
		}
	}
}

const styles = StyleSheet.create({
	progress: {
		justifyContent: 'center',
		alignItems: 'center',
		width: PxFit(120),
		minHeight: PxFit(90),
		backgroundColor: 'rgba(32,30,51,0.7)',
		borderRadius: PxFit(10)
	},
	message: {
		marginTop: PxFit(6),
		fontSize: PxFit(13),
		color: '#fff',
		textAlign: 'center'
	}
});

export default ProgressOverlay;
