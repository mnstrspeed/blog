#!/usr/bin/node

var fs = require('fs');
var md = require('meta-marked');
var jade = require('jade');
var aws = require('aws-sdk');

var model = {
	title: "Things by Tom Sanders",
	theme: "sanfran",
	posts: []
};

var args = process.argv.splice(2);
var paths = args.filter(function(a) {
	return !a.startsWith('--');
});
paths.forEach(function(path) {
	var content = fs.readFileSync(path).toString();
	var article = md(content);
	model.posts.push({
        identifier: "/post/" + article.meta.Identifier,
		path: "#/post/" + article.meta.Identifier,
        meta: article.meta,
		body: article.html
	});
});
model.posts.sort(function(a, b) {
	return new Date(b.meta.Date) - new Date(a.meta.Date);
});

// Render
var render = jade.compileFile('blog.jade', { pretty: true });
var html = render(model);

// Upload
if (args.contains('--dry')) {
	console.log(html);
} else {
	// Upload to server
	aws.config.loadFromPath('./aws-config.json');

	var s3 = new aws.S3();
	s3.putObject({ 
		Bucket: 'www.tomsanders.nl',
		Key: 'index.html',
		ContentType: 'text/html',
		Body: html
	}, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log("Easy.");	
		}
	});
}
