'use strict';

module.exports = {
	app: {
		title: '云豆绘本馆－www.cloud-bean.com',
		description: 'www.cloud-bean.com 云豆绘本馆 给孩子最好的礼物： 最享受的时光，最高贵的教养。',
		keywords: '云豆 cloude-bean 绘本 绘本馆'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/semantic-ui/dist/semantic.css',
				'public/lib/semantic-ui/dist/kitchensink.css',
				'public/lib/ngQuickDate/dist/ng-quick-date.css',
				'public/lib/ngQuickDate/dist/ng-quick-date-default-theme.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/semantic-ui/dist/semantic.js',
				'public/lib/ngQuickDate/dist/ng-quick-date.js',
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
