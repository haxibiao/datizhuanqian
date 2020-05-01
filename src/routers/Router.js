/*
 * @Author: Gaoxuan
 * @Date:   2019-08-01 09:55:03
 */
import MainTabNavigator from './MainTabNavigator';
// 登录注验证
import LoginScreen from '../screens/login';
import ForgetPasswordScreen from '../screens/login/ForgetPassword';
import RetrievePasswordScreen from '../screens/login/RetrievePassword';
import PhoneBindScreen from '../screens/login/PhoneBind';
import VerificationPhoneScreen from '../screens/login/VerificationPhone';
import RegisterSetPasswordScreen from '../screens/login/RegisterSetPassword';
import PasswordLoginScreen from '../screens/login/PasswordLogin';
// 答题
// import AnswerScreen from '../screens/answer/index_back';
import ExerciseScreen from '../screens/answer/Exercise'; //新的答题页
import ExamScreen from '../screens/answer/Exam'; //新的考试页
import UserAnswerScreen from '../screens/answer/UserAnswer';
import MoreCategoriesScreen from '../screens/home/MoreCategories';
import SearchScreen from '../screens/home/Search';
import ExamResultScreen from '../screens/answer/ExamResult';
import RandomAnswer from '@src/screens/answer/RandomAnswer';
//审题
import AuditScreen from '../screens/audit';
// 答题对垒
import CompetitionCategoriesScreen from '../screens/competition/categories';
import CompetitionMatchingScreen from '../screens/competition/matching';
import CompeteScreen from '../screens/competition/compete';
import GameSettlementScreen from '../screens/competition/settlement';
// 小视频
// import MediumScreen from '../screens/video';
// 视频动态
import VideoPostScreen from '../screens/media/VideoPost';
// 题目详情
import QuestionScreen from '../screens/question';
import VideoExplanationScreen from '../screens/question/VideoExplanation';
// 提现
import WithdrawScreen from '@src/screens/withdraw';
import WithdrawLogDetailScreen from '../screens/withdraw/WithdrawLogDetails';
import WithdrawApplyScreen from '../screens/withdraw/WithdrawApply';
// 任务
import CpcTaskScreen from '../screens/task/CpcTask';
import SubmitTaskScreen from '../screens/task/SubmitTask';
import SpiderVideoTaskScreen from '../screens/task/SpiderVideoTask';

// 排行
import RankScreen from '../screens/rank';
import ParticipationScreen from '../screens/participation';

// 出题
import editQuestion from '../screens/contribute/edit'; //新的出题页
import ContributeScreen from '../screens/contribute';
import ContributesScreen from '../screens/contribute/Contributes';
import ContributeRuleScreen from '../screens/contribute/ContributeRule';
import ContributeSubmitedScreen from '../screens/contribute/Submit';
import ContributeEditCategoryScreen from '../screens/contribute/EditCategory';
import ContributeEditOptionsScreen from '../screens/contribute/EditOptions';
import ContributeEditExplainScreen from '../screens/contribute/EditExplain';
import AskQuestionScreen from '../screens/contribute/AskQuestion';

// 分享
import ShareScreen from '../screens/share';
import InviteeListScreen from '../screens/share/InviteeList';
import AppShareCardScreen from '../screens/share/AppShareCard';

// 个人
import EditScreen from '../screens/profile/Edit';
import FavoritesLogScreen from '../screens/profile/FavoritesLog';
import AnswerLogScreen from '../screens/profile/AnswerLog';
import CommonIssueScreen from '../screens/profile/CommonIssue';
import ModifyAliPayScreen from '../screens/profile/ModifyAliPay';
import ModifyPasswordScreen from '../screens/profile/ModifyPassword';
import ModifyAccountScreen from '../screens/profile/ModifyAccount';
import VerificationCodeScreen from '../screens/profile/VerificationCode';
import BillingRecordScreen from '../screens/profile/BillingRecord';
import IntroduceScreen from '../screens/profile/Introduce';
import SocietyScreen from '../screens/profile/Society';
import RecruitScreen from '../screens/profile/Recruit';
import MakeMoenyManualScreen from '../screens/profile/MakeMoenyManual';
import MyPublishScreen from '../screens/profile/MyPublish';
import MyLikes from '@src/screens/profile/MyLikes';
// 通知
import NotificationScreen from '../screens/notification';
import SystemNotificationScreen from '../screens/notification/SystemNotification';
import OfficialNoticeScreen from '../screens/notification/OfficialNotice';
import CommentNotificationScreen from '../screens/notification/CommentNotification';
import FansNotificationScreen from '../screens/notification/FansNotification';
import PushNotificationScreen from '../screens/notification/PushNotification';
import LikeNotificationScreen from '../screens/notification/LikeNotification';
import NoticeItemDetailScreen from '../screens/notification/NoticeItemDetail';
import ChatScreen from '../screens/chat';

// 反馈
import FeedbackScreen from '../screens/feedback';
import FeedbackDetails from '../screens/feedback/FeedbackDetails';

// 举报
import ReportCommentScreen from '../screens/comment/ReportComment';
import ReportUserScreen from '../screens/user/ReportUser';
import ReportQuestionScreen from '../screens/question/ReportQuestion';

// 用户信息
import UserScreen from '../screens/user';
import MedalScreen from '../screens/user/Medal';

// 设置
import SettingScreen from '../screens/setting';
import AccountSecurityScreen from '../screens/setting/AccountSecurity';
import GradeDescriptionScreen from '../screens/setting/GradeDescription';
import UserProtocolScreen from '../screens/setting/UserProtocol';
import ShareAppScreen from '../screens/setting/ShareApp';
import AboutUsScreen from '../screens/setting/AboutUs';
import UpdateLogScreen from '../screens/setting/UpdateLog';
import PrivacyPolicyScreen from '../screens/setting/PrivacyPolicy';
import SetLoginInfoScreen from '../screens/setting/SetLoginInfo';
import SettingWithdrawInfoScreen from '../screens/setting/SettingWithdrawInfo';

export default {
    Main: {
        screen: MainTabNavigator,
    },
    // 登录验证
    Login: {
        screen: LoginScreen,
        params: { trackName: '登录' },
    },
    ForgetPassword: {
        screen: ForgetPasswordScreen,
        params: { trackName: '忘记密码' },
    },
    RetrievePassword: {
        screen: RetrievePasswordScreen,
        params: { trackName: '重置密码' },
    },
    PhoneBind: {
        screen: PhoneBindScreen,
        params: { trackName: '绑定手机' },
    },
    VerificationPhone: {
        screen: VerificationPhoneScreen,
        params: { trackName: '验证手机' },
    },
    RegisterSetPassword: {
        screen: RegisterSetPasswordScreen,
        params: { trackName: '注册设置密码' },
    },
    PasswordLogin: {
        screen: PasswordLoginScreen,
        params: { trackName: '输入密码登录' },
    },
    // 答题
    Answer: {
        screen: ExerciseScreen,
        params: { trackName: '答题' },
    },
    Exam: {
        screen: ExamScreen,
        params: { trackName: '考试' },
    },
    // 答题
    UserAnswer: {
        screen: UserAnswerScreen,
        params: { trackName: '用户主页答题' },
    },
    MoreCategories: {
        screen: MoreCategoriesScreen,
        params: { trackName: '更多题库' },
    },
    Search: {
        screen: SearchScreen,
        params: { trackName: '搜索题库' },
    },
    ExamResult: {
        screen: ExamResultScreen,
        params: { trackName: '考试结果' },
    },
    RandomAnswer: {
        screen: RandomAnswer,
        params: {
            trackName: '随机答题',
        },
    },
    Audit: {
        screen: AuditScreen,
        params: { trackName: '审题' },
    },
    // 答题对垒
    CompetitionCategories: {
        screen: CompetitionCategoriesScreen,
        params: { trackName: '答题PK' },
    },
    // 匹配
    Matching: {
        screen: CompetitionMatchingScreen,
        params: { trackName: '答题PK匹配' },
    },
    // 比赛
    Compete: {
        screen: CompeteScreen,
        params: { trackName: '答题PK对战页' },
    },
    // 比赛
    GameSettlement: {
        screen: GameSettlementScreen,
        params: { trackName: '答题PK结束' },
    },
    // 短视频
    // Medium: {
    //     screen: MediumScreen,
    // },
    // 题目详情
    Question: {
        screen: QuestionScreen,
        params: { trackName: '题目详情' },
    },
    VideoPost: {
        screen: VideoPostScreen,
        params: { trackName: '视频动态' },
        path: 'videoPost/:medium',
    },
    VideoExplanation: {
        screen: VideoExplanationScreen,
        params: { trackName: '视频解析' },
    },
    // 提现
    Withdraw: {
        screen: WithdrawScreen,
        params: { trackName: '钱包提现' },
    },
    withdrawLogDetails: {
        screen: WithdrawLogDetailScreen,
        params: { trackName: '提现记录详情' },
    },
    WithdrawApply: {
        screen: WithdrawApplyScreen,
        params: { trackName: '申请提现成功' },
    },
    // 任务
    CpcTask: {
        screen: CpcTaskScreen,
        params: { trackName: 'CPC任务' },
    },
    SubmitTask: {
        screen: SubmitTaskScreen,
        params: { trackName: '提交任务' },
    },
    SpiderVideoTask: {
        screen: SpiderVideoTaskScreen,
        params: { trackName: '采集视频任务介绍' },
    },
    // 排行
    Rank: {
        screen: RankScreen,
        params: { trackName: '排行榜' },
    },
    // 分红
    Participation: {
        screen: ParticipationScreen,
        params: { trackName: '分红' },
    },
    // 出题
    Contribute: {
        screen: editQuestion,
        params: { trackName: '出题' },
    },
    Contributes: {
        screen: ContributesScreen,
        params: { trackName: '我的出题' },
    },
    ContributeRule: {
        screen: ContributeRuleScreen,
        params: { trackName: '出题规则' },
    },
    ContributeSubmited: {
        screen: ContributeSubmitedScreen,
        params: { trackName: '出题成功提交结果' },
    },
    EditCategory: {
        screen: ContributeEditCategoryScreen,
        params: { trackName: '出题选择题库' },
    },
    EditOptions: {
        screen: ContributeEditOptionsScreen,
        params: { trackName: '出题选择答案选项' },
    },
    EditExplain: {
        screen: ContributeEditExplainScreen,
        params: { trackName: '出题解析' },
    },
    AskQuestion: {
        screen: AskQuestionScreen,
        params: { trackName: '有奖问答' },
    },

    // 分享
    Share: {
        screen: ShareScreen,
        params: { trackName: '分享' },
    },
    InviteeList: {
        screen: InviteeListScreen,
        params: { trackName: '分享邀请历史' },
    },
    AppShareCard: {
        screen: AppShareCardScreen,
        params: { trackName: '分享卡片' },
    },

    // 个人
    EditProfile: {
        screen: EditScreen,
        params: { trackName: '编辑资料' },
    },
    FavoritesLog: {
        screen: FavoritesLogScreen,
        params: { trackName: '收藏记录' },
    },
    AnswerLog: {
        screen: AnswerLogScreen,
        params: { trackName: '答题记录' },
    },

    CommonIssue: {
        screen: CommonIssueScreen,
        params: { trackName: '常见问题' },
    },
    ModifyAliPay: {
        screen: ModifyAliPayScreen,
        params: { trackName: '修改支付宝' },
    },
    ModifyPassword: {
        screen: ModifyPasswordScreen,
        params: { trackName: '修改密码' },
    },
    ModifyAccount: {
        screen: ModifyAccountScreen,
        params: { trackName: '修改账号' },
    },
    VerificationCode: {
        screen: VerificationCodeScreen,
        params: { trackName: '验证手机 ' },
    },
    BillingRecord: {
        screen: BillingRecordScreen,
        params: { trackName: '我的账单' },
    },
    Introduce: {
        screen: IntroduceScreen,
        params: { trackName: '答题须知' },
    },
    Society: {
        screen: SocietyScreen,
        params: { trackName: '粉丝关注' },
    },
    Recruit: {
        screen: RecruitScreen,
        params: { trackName: '版主招募' },
    },
    MakeMoenyManual: {
        screen: MakeMoenyManualScreen,
        params: { trackName: '赚钱攻略' },
    },
    MyPublish: {
        screen: MyPublishScreen,
        params: { trackName: '我的发布' },
    },
    MyLikes: {
        screen: MyLikes,
        params: {
            trackName: '我的喜欢',
        },
    },
    // 通知
    Notification: {
        screen: NotificationScreen,
        params: { trackName: '通知' },
    },
    SystemNotification: {
        screen: SystemNotificationScreen,
        params: { trackName: '系统通知' },
    },
    OfficialNotice: {
        screen: OfficialNoticeScreen,
        params: { trackName: '官方公告' },
    },
    CommentNotification: {
        screen: CommentNotificationScreen,
        params: { trackName: '评论通知' },
    },
    FansNotification: {
        screen: FansNotificationScreen,
        params: { trackName: '评论通知' },
    },
    PushNotification: {
        screen: PushNotificationScreen,
        params: { trackName: '推送通知' },
    },
    LikeNotification: {
        screen: LikeNotificationScreen,
        params: { trackName: '点赞通知' },
    },
    NoticeItemDetail: {
        screen: NoticeItemDetailScreen,
        params: { trackName: '公告详情' },
    },
    Chat: {
        screen: ChatScreen,
        params: { trackName: '聊天' },
    },
    // 反馈
    Feedback: {
        screen: FeedbackScreen,
        params: { trackName: '反馈' },
    },
    FeedbackDetails: {
        screen: FeedbackDetails,
        params: { trackName: '反馈详情' },
    },
    // 举报
    ReportUser: {
        screen: ReportUserScreen,
        params: { trackName: '举报用户' },
    },
    ReportComment: {
        screen: ReportCommentScreen,
        params: { trackName: '举报评论' },
    },
    ReportQuestion: {
        screen: ReportQuestionScreen,
        params: { trackName: '举报题目' },
    },
    // 用户
    User: {
        screen: UserScreen,
        params: { trackName: '用户' },
    },
    Medal: {
        screen: MedalScreen,
        params: { trackName: '勋章' },
    },
    //  设置
    Setting: {
        screen: SettingScreen,
        params: { trackName: '设置' },
        path: 'setting/:routName',
    },
    AccountSecurity: {
        screen: AccountSecurityScreen,
        params: { trackName: '账户中心' },
    },
    GradeDescription: {
        screen: GradeDescriptionScreen,
        params: { trackName: '等级说明' },
    },
    UserProtocol: {
        screen: UserProtocolScreen,
        params: { trackName: '用户协议' },
    },
    ShareApp: {
        screen: ShareAppScreen,
        params: { trackName: '分享App' },
    },
    AboutUs: {
        screen: AboutUsScreen,
        params: { trackName: '关于我们' },
    },
    UpdateLog: {
        screen: UpdateLogScreen,
        params: { trackName: '更新记录' },
    },
    PrivacyPolicy: {
        screen: PrivacyPolicyScreen,
        params: { trackName: '隐私政策' },
    },
    SetLoginInfo: {
        screen: SetLoginInfoScreen,
        params: { trackName: '完善登录信息' },
    },
    SettingWithdrawInfo: {
        screen: SettingWithdrawInfoScreen,
        params: { trackName: '绑定支付宝信息' },
    },
};
