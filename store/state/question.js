import { Record, List } from "immutable";

export const question = Record({
	plate: [
		{
			id: 1,
			name: "英语学习",
			description: "学习全球通用语言的板块",
			avatar: require("../../assets/images/yingyu.png")
		},
		{
			id: 2,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 3,
			name: "游戏问答",
			description: "同学们,游戏富裕你生命快来作战吧",
			avatar: require("../../assets/images/youxi2.jpeg")
		},
		{
			id: 4,
			name: "驾考知识",
			description: "驾考理论知识不可缺少",
			avatar: require("../../assets/images/jiakao.jpeg")
		},
		{
			id: 5,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		},
		{
			id: 6,
			name: "游戏问答",
			description: "同学们,游戏富裕你生命快来作战吧",
			avatar: require("../../assets/images/youxi2.jpeg")
		},
		{
			id: 7,
			name: "动漫知识",
			description: "幻想,二次元快来成为热血的英雄吧",
			avatar: require("../../assets/images/dongman.jpeg")
		}
	],
	question: [
		{
			id: 1,
			title: "英雄联盟S1的冠军是？",
			answer: 3,
			option: {
				A: "SKT",
				B: "WE",
				C: "Fnatic",
				D: "TPA"
			},
			value: 1
		},
		{
			id: 2,
			title: "中国英雄联盟第一个世界冠军是？",
			answer: 2,
			option: {
				A: "EDG",
				B: "WE",
				C: "IG",
				D: "RNG"
			},
			value: 1
		},
		{
			id: 3,
			title: "绝地求生S1897的弹夹有少发子弹？",
			answer: 2,
			option: {
				A: "5",
				B: "7",
				C: "9",
				D: "15"
			},
			value: 1
		}
	]
});
