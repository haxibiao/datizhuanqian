import React, { Component } from 'react';
import { PageContainer } from 'components';

import UserProtocolView from './components/UserProtocolView';

export default function UserProtocol() {
	return (
		<PageContainer title="用户协议" white>
			<UserProtocolView />
		</PageContainer>
	);
}
