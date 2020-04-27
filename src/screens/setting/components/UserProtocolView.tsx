import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Theme, PxFit, Config } from 'utils';

export default () => {
	return (
		<ScrollView style={styles.container}>
			<View style={{ alignItems: 'center', marginTop: PxFit(15) }}>
				<Text style={styles.titleText}>{Config.AppName}用户协议</Text>
			</View>
			<View style={{ paddingHorizontal: PxFit(15), marginTop: PxFit(20) }}>
				<View>
					<Text style={styles.sectionTitleText}>欢迎您来到{Config.AppName}</Text>
					<Text style={{ lineHeight: PxFit(20), color: Theme.secondaryTextColor }}>
						请您仔细阅读以下条款，如果您对本协议的任何条款表示异议，您可以选择不进入
						{Config.AppName}
						。当您注册成功，无论是进入{Config.AppName}，还是在{Config.AppName}
						上使用任何服务，或者是直接或通过各类方式（如站外API引用等）间接使用
						{Config.AppName}
						网服务和数据的行为，都将被视作已无条件接受本声明所涉全部内容。
						若您对本声明的任何条款有异议，请停止使用{Config.AppName}网所提供的全部服务。
					</Text>
					<Text style={styles.sectionTitleText}>使用规则</Text>
					<Text style={styles.lineHeight}>
						1、 用户注册成功后，{Config.AppName}
						将给予每个用户一个用户帐号及相应的密码，该用户帐号和密码由用户负责保管；用户应当对以其用户帐号进行的所有答题和事件负法律责任。
					</Text>
					<Text style={styles.lineHeight}>
						2、 用户须对在{Config.AppName}
						的注册信息的真实性、合法性、有效性承担全部责任，用户不得冒充他人；不得利用他人的名义发布任何信息；不得恶意使用注册帐号导致其他用户误认； 任何机构或个人注册和使用的互联网用户账号名称，不得有下列情形：（一）违反宪法或法律法规规定的；（二）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；（三）损害国家荣誉和利益的，损害公共利益的；（四）煽动民族仇恨、民族歧视，破坏民族团结的；（五）破坏国家宗教政策，宣扬邪教和封建迷信的；（六）散布谣言，扰乱社会秩序，破坏社会稳定的；（七）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；（八）侮辱或者诽谤他人，侵害他人合法权益的；（九）含有法律、行政法规禁止的其他内容的。
					</Text>
					<Text style={styles.lineHeight}>
						3、关于用户名的管理
						{
							'\n请勿以党和国家领导人或其他名人的真实姓名、字、号、艺名、笔名、头衔等注册和使用昵称（如确为本人，需要提交相关证据并通过审核方可允许使用）；'
						}
						{
							'\n请勿以国家组织机构或其他组织机构的名称等注册和使用昵称（如确为该机构，需要提交相关证据并通过审核方可允许使用）；'
						}
						{'\n请勿注册和使用与其他网友相同、相仿的名字或昵称；'}
						{'\n请勿注册和使用不文明、不健康的ID和昵称；'}
						{'\n请勿注册和使用易产生歧义、引起他人误解或带有各种奇形怪状符号的ID和昵称。'}
						{'\n用户以虚假信息骗取账号名称注册，或账号头像、简介等注册信息存在违法和不良信息的，' +
							Config.AppName +
							'将暂停或注销。'}
						{'\n用户连续一年及以上没有使用' +
							Config.AppName +
							'，' +
							Config.AppName +
							'有权收回该用户昵称。'}
						{'\n用户承诺不得以任何方式利用' +
							Config.AppName +
							'直接或间接从事违反中国法律、以及社会公德的行为，' +
							Config.AppName +
							'有权对违反上述承诺的内容予以删除。'}
						{'\n' +
							Config.AppName +
							'有权对用户使用' +
							Config.AppName +
							'的情况进行审查和监督，如用户在使用' +
							Config.AppName +
							'时违反任何上述规定，' +
							Config.AppName +
							'或其授权的人有权要求用户改正或直接采取一切必要的措施（包括但不限于更改或删除用户张贴的内容、暂停或终止用户使用' +
							Config.AppName +
							'的权利）以减轻用户不当行为造成的影响。'}
					</Text>
					<Text style={styles.sectionTitleText}>服务内容</Text>
					<Text style={styles.lineHeight}>
						{'' +
							Config.AppName +
							'的具体内容由本程序根据实际情况提供，您可以根据自身的情况选择相应类型的题目。'}
						{'\n' +
							Config.AppName +
							'中的问题答案以程序给出的答案为准，如有发现错误，请使用' +
							Config.AppName +
							'的反馈功能向我们反映。'}
						{'\n提现规则说明 只有当你完成支付宝账号绑定之后，才能开始提现。'}
						{
							'\n提现额度分为1元、3元、5元、10元四档，每次提现时您可以选择所需的的一档提现额度，剩余金额可以在下次满足前述提现额度时申请提现。'
						}
						{'\n' + Config.AppName + '中的提现汇率以提现时程序显示汇率为准。'}
						{'\n提现一般3-5天内到账（您理解并同意如遇提现高峰，提现到账时间会延长）。'}
						{
							'\n为保证用户顺利提现，提现需用户按照提现页面规范操作，如用户未按照提现要求操作或不符合第三方支付平台的要求等原因导致不能收款（如未做实名认证或提现前与平台账号解绑等），所获得的红包将无法提现，本平台无需承担任何责任。我们可在法律法规允许的范围内对答题规则解释并做出适当修改。'
						}
					</Text>
					<Text style={styles.sectionTitleText}>注意事项</Text>
					<Text style={styles.lineHeight}>
						1、用户不得以任何不正当手段或舞弊的方式参与本答题。一经发现，本平台有权采取限制账号登录、封禁账号、撤销答题资格、限制提现、账号金额清零、限制再次注册等措施，亦有权收回用户已提现的金额，并保留追究该用户责任的权利。如因此给用户造成损失，本平台不进行任何赔偿或补偿。不正当手段及舞弊行为包括但不限于：下载非官方客户端；使用插件、外挂、等非法工具下载、安装、注册、登录、答题、提现；注册多个账号；篡改设备数据；恶意牟利等扰乱平台秩序。
						本平台依法经营此次答题，如因不可抗力、相关政策、答题调整等原因导致本次答题调整、暂停举办或无法进行的，本平台有权随时觉得修改、暂停、取消或终止本答题，并无需为此承担任何法律责任。
						如因第三方同过各种不正当手段攻击、篡改，对本平台及本次答题进行干扰、破坏、修改或施加其他影响或系统故障致使提现发生错误、用户无法参与的，本平台无需为此承担任何法律责任。
						答题期间，因用户操作不当或用户所在地区网络故障、支付平台网络故障、电信运营商故障、第三方其他平台限制等非本平台所能控制的原因导致的用户无法参与答题、或参与失败，本平台无需为此承担任何法律责任。
						请用户务必通过 {Config.AppName}
						客户端参与答题。任何第三方以本平台宣称或从事类似答题造成用户损失的，无需为此承担任何法律责任。
						在法律允许的范围内，本平台有权对本答题规则进行调整或变动。相关变动或调整将公布在相应的页面上，并与公布时即刻生效，用户继续参与答题则视为对调整的规则予以同意。如用户拒绝上述调整，应立刻停止答题。
						版权声明 本站的文字、图片等版权均归{Config.AppName}
						享有，未经本站许可，不得任意转载。
					</Text>
					<Text style={styles.lineHeight}>
						2、本站特有的标识、版面设计、编排方式等版权均属{Config.AppName}
						享有，未经本站许可，不得任意复制或转载。
					</Text>
					<Text style={styles.lineHeight}> 3、恶意转载本站内容的，本站保留将其诉诸法律的权利。</Text>
					<Text style={styles.sectionTitleText}>隐私保护</Text>
					<Text style={styles.lineHeight}>
						尊重用户个人隐私信息的私有性是{Config.AppName}的一贯原则，{Config.AppName}
						将通过技术手段、强化内部管理等办法充分保护用户的个人隐私信息，除法律或有法律赋予权限的政府部门要求或事先得到用户明确授权等原因外，
						{Config.AppName}
						保证不对外公开或向第三方透露用户个人隐私信息，或用户在使用服务时存储的非公开内容。
					</Text>
					<Text style={styles.sectionTitleText}>免责申明</Text>
					<Text style={styles.lineHeight}>
						1、{Config.AppName}
						不保证网络服务一定能满足用户的要求，也不保证网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作保证。
					</Text>
					<Text style={styles.lineHeight}>
						2、对于因不可抗力或{Config.AppName}不能控制的原因造成的网络服务中断或其它缺陷，
						{Config.AppName}不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。
					</Text>
					<Text style={styles.lineHeight}>
						3、对于用户由于自身原因造成账号丢失，从而造成的损失和影响，将由用户自己承担、与
						{Config.AppName}无关。
					</Text>
					<Text style={styles.sectionTitleText}>协议修改</Text>
					<Text style={styles.lineHeight}>
						1、根据互联网的发展和有关法律、法规及规范性文件的变化，或者因业务发展需要，
						{Config.AppName}有权对本协议的条款作出修改或变更，一旦本协议的内容发生变动，
						{Config.AppName}将会直接在{Config.AppName}
						网站上公布修改之后的协议内容，该公布行为视为
						{Config.AppName}已经通知用户修改内容。{Config.AppName}
						也可采用电子邮件或私信的传送方式，提示用户协议条款的修改、服务变更、或其它重要事项。
						如果不同意{Config.AppName}对本协议相关条款所做的修改，用户有权并应当停止使用
						{Config.AppName}。如果用户继续使用{Config.AppName}，则视为用户接受
						{Config.AppName}
						对本协议相关条款所做的修改。 附则
						本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
					</Text>
					<Text style={styles.lineHeight}>
						2、如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。
					</Text>
					<Text style={styles.lineHeight}>
						3、本协议解释权及修订权归{Config.AppName}所有。 有任何问题可以使用
						{Config.AppName}
						的意见反馈功能反馈给我们。
					</Text>
					<Text style={{ lineHeight: PxFit(18), paddingVertical: PxFit(20) }}>
						你的鼓励和支持是我们一直前进的动力！
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white
	},
	titleText: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(16)
	},
	sectionTitleText: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(15),
		paddingVertical: PxFit(10)
	},
	lineHeight: {
		color: '#969696',
		lineHeight: PxFit(18)
	}
});
