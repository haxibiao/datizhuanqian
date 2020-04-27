import React from 'react';
import { PageContainer } from 'components';
import PrivacyPolicyView from './components/PrivacyPolicyView';

export default function PrivacyPolicy() {
	return (
		<PageContainer title="隐私政策" white>
			<PrivacyPolicyView />
		</PageContainer>
	);
}
