'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/hbg',
	assets: {
		lib: {
			css: [
				// 'public/lib/semantic-ui/dist/semantic.min.css',
				// 'public/lib/semantic-ui/dist/semantic.kitchensink.css',
				'http://cloudbean.qiniudn.com/hbg2-kitchensink.css',
				'http://cloudbean.qiniudn.com/hbg2-semantic.min.css',
			],
			js: [
				'http://lib.sinaapp.com/js/angular.js/angular-1.2.19/angular.min.js',
				'http://lib.sinaapp.com/js/angular.js/angular-1.2.19/angular-cookies.js',
				'http://lib.sinaapp.com/js/angular.js/angular-1.2.19/angular-sanitize.min.js',
				'http://lib.sinaapp.com/js/angular.js/angular-1.2.19/angular-animate.min.js',
				'http://lib.sinaapp.com/js/angular.js/angular-1.2.19/angular-resource.min.js',
				'http://lib.sinaapp.com/js/angular.js/angular-1.2.19/angular-touch.min.js',
				'//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js',
				'//cdnjs.cloudflare.com/ajax/libs/angular-ui-utils/0.1.1/angular-ui-utils.min.js',
				'http://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js',
				'http://cloudbean.qiniudn.com/hbg2-semantic.min.js', 
				// 'public/lib/angular/angular.min.js',
				// 'public/lib/angular-resource/angular-resource.js', 
				// 'public/lib/angular-cookies/angular-cookies.js', 
				// 'public/lib/angular-animate/angular-animate.js', 
				// 'public/lib/angular-touch/angular-touch.js', 
				// 'public/lib/angular-sanitize/angular-sanitize.js', 
				// 'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				// 'public/lib/jquery/dist/jquery.min.js', 
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
