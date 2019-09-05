'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';

import { PageContainer, TouchFeedback, Iconfont, Row, ListItem } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';

class PrivacyPolicy extends Component {
	render() {
		return (
			<PageContainer title="隐私政策" white>
				<ScrollView style={styles.container}>
					<View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
						<Text style={styles.title}>
							{Config.AppName}
							隐私政策
						</Text>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								{Config.AppName}
								（以下简称“我们”或“公司”）深知个人信息安全的重要性，我们将按照法律法规的规定，采用安全保护措施，保护您的个人信息及隐私安全。因此，我们制定《
								{Config.AppName}
								隐私政策》（以下简称“本《隐私政策》”）并提醒您：在使用“
								{Config.AppName}
								”软件及相关服务、提交个人信息前，请务必仔细阅读并透彻理解本《隐私政策》，在确认充分理解并同意后方使用相关产品和服务。一旦您开始使用“
								{Config.AppName}
								”软件及相关服务，则视为您对本政策内容的接受和认可。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								我们非常重视用户个人信息的保护，并且将以高度勤勉和审慎的义务对待这些信息。您在下载、安装、开启、浏览、注册、登录、使用（以下统称“使用”）“
								{Config.AppName}
								”软件及相关服务时，我们将按照本《隐私政策》收集、保存、使用、共享、披露及保护您的个人信息。我们希望通过本《隐私政策》向您介绍我们对您个人信息的处理方式，因此我们再次建议您认真完整地阅读本《隐私政策》的所有条款。其中，免除或者限制责任条款等重要内容将以加粗形式提示您注意，您应重点阅读。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								本《隐私政策》中所述的“
								{Config.AppName}
								”软件及相关服务有可能会根据您所使用的手机型号、系统版本、软件应用程序版本等因素而有所不同。最终的产品和服务以您所使用的“
								{Config.AppName}
								”软件及相关服务为准。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>
								如果您不同意本《隐私政策》的内容，将导致“
								{Config.AppName}
								”软件及相关服务无法正常运行，我们将无法为您提供完整的产品和服务，同时也请您立即停止使用“
								{Config.AppName}
								”软件及相关服务。当您开始使用“
								{Config.AppName}
								”软件及相关服务，将视同您完全理解且同意本《隐私政策》的全部内容。在我们更新本《隐私政策》后（我们会及时在“
								{Config.AppName}
								”平台发布最新版本），如您继续使用“
								{Config.AppName}
								”的软件及相关服务，即意味着您完全理解本《隐私政策》（含更新版本）的全部内容，并同意我们按照本《隐私政策》收集、保存、使用、共享、披露及保护您的相关个人信息
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								《隐私政策》适用于我们向您提供的“
								{Config.AppName}
								”软件及相关服务，无论您是通过计算机设备、移动设备或其他终端设备获得该等软件或服务。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>一、个人信息可能收集的范围与方式</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								当您在使用“
								{Config.AppName}
								”软件及相关服务时，您理解并同意，我们将可能收集、储存和使用下列与您个人信息有关的数据，这些信息可用于您注册、登录、绑定账号、密码找回时接收验证码等功能，如果您不提供相关信息，可能无法注册成为我们的用户或无法享受我们提供的某些服务，或者无法达到相关服务拟达到的效果。
								在您使用“
								{Config.AppName}
								”软件及相关服务的某些功能时，根据中华人民共和国相关法律法规，您可能需要通过您的账号提供您的真实身份信息，我们将会根据您的身份属性协助您选择合适的方式完成实名验证。如果您仅需使用浏览、搜索等基本功能，您不需要注册“
								{Config.AppName}
								”账号，也不需要提供相关信息。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>1.您向我们提供的信息</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								1.1您注册、登录或使用“
								{Config.AppName}
								”软件及相关服务时填写和/或提供的信息，可能包括姓名、手机号码、电子邮箱、地址等能够单独或者与其他信息结合识别用户身份的信息。您可以选择不提供某一或某些信息，但是这样可能使您无法正常使用“
								{Config.AppName}
								”软件及相关服务的某些功能。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								1.2 若您以其他方式关联登录、使用“
								{Config.AppName}
								”软件及相关服务，我们会向第三方请求您的个人信息，对于我们需要但第三方无法提供的个人信息，我们仍会要求您提供。如果您拒绝提供，将可能导致您无法正常使用“
								{Config.AppName}
								”软件及相关服务的某些功能。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>
								2.因您使用“
								{Config.AppName}
								”软件及服务获取的信息
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								2.1日志信息，当您使用“
								{Config.AppName}
								”软件及相关服务时，我们会自动收集您对我们服务的使用情况，作为有关网络日志保存。例如您的搜索查询内容、IP地址、浏览器的类型、使用的语言、访问服务的日期和时间、Cookie、Web
								Beacon等。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								2.2设备或应用信息，某些移动设备或应用包含唯一应用程序编号。例如您使用的移动设备、浏览器或用于接入“
								{Config.AppName}
								”软件及相关服务的其他程序所提供的配置信息、设备版本号、设备识别码等。
								为了向您提供更好的服务与改善您的用户体验，“
								{Config.AppName}
								”软件及相关服务可能会记录硬件型号、操作系统版本号、国际移动设备识别码（IMEI）、网络设备硬件地址（MAC）、软件列表等软硬件数据。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								2.3位置信息。当您开启设备定位功能并使用“
								{Config.AppName}
								”软件及相关服务基于位置提供的相关服务时，在获得您的同意后，我们会使用各种信息进行定位，以使得您不需要手动输入自身地理坐标就可获得相关服务。这些信息包括IP地址、GPS信号以及能够提供相关位置信息的其他传感器信息等（如可能需要提供附近设备、Wi-Fi接入点和基站的信息）。为了提升您的体验，我们也可能会通过位置信息用以为您提供更具有个性化的服务，在征得您的同意后，将可能用于向您推荐更符合您个性化需求内容。您可以通过关闭定位功能，停止向“
								{Config.AppName}
								”软件及相关服务提供您的地理位置信息，我们理解大多数移动设备均允许您（针对特定的产品或服务）关闭定位服务，具体建议请您联系您的移动设备的服务商或生产商。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>
								3.当您使用
								{Config.AppName}
								的搜索服务时，我们会收集您的搜索关键字信息、设备信息等。为了提供高效的搜索服务，部分前述信息会暂时存储在您的本地存储设备之中。您理解并同意，如您的搜索关键字信息无法单独或结合其他信息识别到您的个人身份，其不属于法律意义上的个人信息，因此我们有权以其他的目的对其进行使用；只有当您的搜索关键字信息可以单独或结合其他信息识别到您的个人身份时，则在结合使用期间，我们会将您的搜索关键字信息作为您的个人信息，与您的搜索历史记录一同按照本《隐私政策》对其进行处理与保护。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>
								4.在您使用“
								{Config.AppName}
								”软件及相关服务提供的身份认证功能时，我们会根据相关法律法规规定和/或该身份认证功能所必需，收集您的姓名、身份证号等有关身份证明的信息，我们将对您的这些信息会加以最大程度的保护，如果您不提供这些信息，您将可能无法获得相关服务。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>
								5.当您参加我们举办的有关营销活动时，我们根据活动需要可能会收集您的姓名、通信地址、联系方式、银行账号等信息。这些信息是您收到转账或者礼品所必要的，如果您拒绝提供这些信息，我们将可能无法向您转账或发放礼品。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>
								6.当您自愿参加我们以问卷、深度访谈、焦点小组等方式开展的市场调研活动时，我们可能会在您同意的前提下匿名收集您的年龄、性别与联系方式等信息，以完成相应的用户体验调研。除非得到您的事先同意，这些信息将仅用于前述之目的，我们将不会向任何第三方披露您的任何相关信息，或将该等信息用于其他目的。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>二、个人信息可能的共享方式</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								1.我们会以高度的勤勉义务对待您的信息。在获得您的明确同意后，我们可能会与第三方共享您的个人信息。另外，我们可能会按照法律法规的要求或强制性的政府要求或司法裁定等，与相关的第三方共享您的个人信息。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								2.在获得您的同意后，我们可能会将您的个人信息与我们的关联方共享。受限于您在本《隐私政策》中所同意的个人信息使用方式与目的，我们只会与关联方共享必要的个人信息。关联方如因业务需要，确需超出前述授权范围使用个人信息的，将再次征求您的授权同意。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								3.为实现“
								{Config.AppName}
								”产品及相关服务的完整功能以及本《隐私政策》中声明的若干目的，我们的某些服务将由授权第三方提供。我们可能会与此等授权第三方共享您的某些个人信息，以提供更好的客户服务和用户体验。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供该等服务所必要的个人信息。授权第三方无权将共享的个人信息用于任何其他用途，或向其他任何第三方作进一步的披露。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								4.我们非常重视您个人信息的安全，将努力采取各种符合业界标准的合理的安全措施（包括技术方面和管理方面）来保护您的个人信息，防止您提供的个人信息，防止数据被不当使用或被未经授权的访问、公开披露、使用、修改、损坏、丢失或泄漏。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								5.我们会使用加密技术、匿名化处理等合理可行的手段保护您的个人信息，并使用受信赖的保护机制防止您的个人信息遭到恶意攻击。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								6.我们会建立专门的安全部门、安全管理制度、数据安全流程保障您的个人信息安全。我们采取严格的数据使用和访问制度，确保只有授权人员才可访问您的个人信息，并适时对数据和技术进行安全审计。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								7.尽管已经采取了上述合理有效措施，并已经遵守了相关法律规定要求的标准，但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全，我们将尽力确保您提供给我们的个人信息的安全性。您知悉并理解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。因此，我们强烈建议您采取积极措施保护个人信息的安全，包括但不限于使用复杂密码、定期修改密码、不将自己的账号密码等个人信息透露给他人。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								8.我们会制定应急处理预案，并在发生用户信息安全事件时立即启动应急预案，努力阻止该等安全事件的影响和后果扩大。一旦发生用户信息安全事件（泄露、丢失等）后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已经采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以推送通知、邮件、信函、短信等形式告知您，难以逐一告知时，我们会采取合理、有效的方式发布公告。同时，我们还将按照相关监管部门要求，上报用户信息安全事件的处置情况。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								9.我们谨此特别提醒您，本《隐私政策》提供的个人信息保护措施仅适用于“
								{Config.AppName}
								”软件及相关服务。一旦您离开“
								{Config.AppName}
								”及相关服务，浏览或使用其他网站、服务及内容资源，我们即没有能力及义务保护您在“
								{Config.AppName}
								”软件及相关服务之外的应用、网站提交的任何个人信息，无论您登录或浏览上述软件、网站是否基于“
								{Config.AppName}
								”的链接或引导，我们对此不承担任何法律责任。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>三、隐私政策的变更</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>
								为了给您提供更好的服务，“
								{Config.AppName}
								”软件及相关服务将不时更新与变化，我们会适时对本《隐私政策》进行修订，该等修订构成本《隐私政策》的一部分并具有等同于本《隐私政策》的效力。但未经您明确同意，我们不会削减您依据当前生效的本《隐私政策》所应享受的权利。
								本《隐私政策》更新后，我们会在“
								{Config.AppName}
								”平台（即移动应用程序客户端）发出更新版本，并在更新后的条款生效前通过公告或其他适当的方式提醒您更新的内容，以便您及时了解本《隐私政策》的最新版本。
								对于重大变更，我们还会提供更为显著的通知（我们会通过包括但不限于邮件、短信、私信或在浏览页面做特别提示等方式，说明《隐私政策》的具体变更内容）。本《隐私政策》所指的重大变更包括但不限于：
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								1.我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息的类型、个人信息的使用方式等；
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								2.我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有变更等；
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								3.个人信息共享、转让或公开披露的主要对象发生变化；
								4.您参与个人信息处理方面的权利及其行使方式发生重大变化；
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								5.我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；
								6.个人信息安全影响评估报告表明存在高风险时。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.darkFont}>四、其他 </Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								1.本《隐私政策》的标题仅为方便及阅读而设，并不影响本《隐私政策》中任何规定的含义或解释。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								2.如果您对本《隐私政策》或其中有关您个人信息的收集、保存、使用、共享、披露、保护等功能存在意见或建议时，您可以通过“
								{Config.AppName}
								”功能页面、或“
								{Config.AppName}
								”用户反馈渠道反馈意见或投诉。我们会在收到您的意见及建议后尽快向您反馈。
							</Text>
						</View>
						<View style={styles.fontWrap}>
							<Text style={styles.tintFont}>
								3.本《隐私政策》的版权为公司所有，在法律允许的范围内，公司保留最终解释和修改的权利。
							</Text>
						</View>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white
	},
	fontWrap: {
		marginTop: 10
	},
	title: {
		fontSize: 18,
		fontWeight: '500',
		textAlign: 'center',
		marginBottom: 10,
		color: Theme.black
	},
	darkFont: {
		fontSize: 15,
		lineHeight: 20,
		color: Theme.primaryFontColor
	},
	tintFont: {
		fontSize: 15,
		lineHeight: 20,
		color: Theme.subTextColor
	}
});

export default PrivacyPolicy;
