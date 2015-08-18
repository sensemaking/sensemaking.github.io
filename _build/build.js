var fs = require('fs');
var fm = require('front-matter');
var marked = require('marked');
var moment = require('moment');
var _ = require('lodash');
var root = 'http://www.sensemaking.uk.com';

var template = loadPostTemplate();
var postData = loadPosts();
var mostRecent = _.take(postData, 5);
writePosts(postData, template);

var indexTemplate = loadIndexTemplate();
writeIndex(postData[0].url, indexTemplate);

var sitemapTemplate = loadSitemapTemplate();
writeSitemap(postData, sitemapTemplate);

function loadIndexTemplate() {
    return _.template(fs.readFileSync('_index.html', 'utf8'));
}

function loadPostTemplate() {
    return _.template(fs.readFileSync('_blog.html', 'utf8'));
}

function loadSitemapTemplate() {
    return _.template(fs.readFileSync('_sitemap.xml', 'utf8'));
}

function loadPosts() {
    var postNames = fs.readdirSync('../_posts');
    return _.chain(postNames).map(function(postFilename) {
        var postText = fs.readFileSync('../_posts/' + postFilename,'utf8');
        var postData = fm(postText);
        var properties = _.merge(postData.attributes, {
            filename: postFilename,
            url: makePostUrl(postFilename),
            body: marked(postData.body)
        });
        properties.datestamp = moment(properties.datestamp);

        return properties;
    }).sortBy(postData, 'datestamp').value();
}

function writePosts(posts, postTemplate) {
    for(var i = 0; i < posts.length; i ++) {
        var currentPost = posts[i];
        var prevPost = (i+1 < posts.length) ? posts[i+1].url : null;
        var nextPost = i > 0 ? posts[i-1].url : null;

        var templateProps = _.merge({},currentPost,{ next: nextPost, prev: prevPost, recent: mostRecent, first: posts[0].url, disqus: getDisqusCode(currentPost) });

        //console.log("Processing\n",JSON.stringify(templateProps));

        var post = postTemplate(templateProps);
        fs.writeFileSync('..' + currentPost.url, post);
    }
}

function writeIndex(blogUrl, template) {
    var index = template({ blogUrl: blogUrl });
    fs.writeFileSync('../index.html', index);
}

function writeSitemap(posts, template) {
    var urls = _.map(posts,function(post) {
        return root + post.url;
    });
    urls.push(root + '/index.html');

    var sitemap = template({urls: urls});
    fs.writeFileSync('../sitemap.xml', sitemap);
}

function makePostFilename(postName) {
    return '../posts/' + postName.slice(0, -2) + 'html';
}

function makePostUrl(postName) {
    return '/posts/' + postName.slice(0, -2) + 'html';
}

function getDisqusCode(post) {
    return '<div id="disqus_thread"></div>\n'+
    '<script type="text/javascript">\n'+
    '    /*** CONFIGURATION VARIABLES ***/\n'+
    '    var disqus_shortname = \'sense-making\';\n'+
    '    var disqus_title = \'' + post.title + '\';\n'+
    '    /*** DON\'T EDIT BELOW THIS LINE ***/\n'+
    '    (function() {\n'+
    '        var dsq = document.createElement(\'script\'); dsq.type = \'text/javascript\'; dsq.async = true;\n'+
    '        dsq.src = \'//\' + disqus_shortname + \'.disqus.com/embed.js\';\n'+
    '        (document.getElementsByTagName(\'head\')[0] || document.getElementsByTagName(\'body\')[0]).appendChild(dsq);\n'+
    '    })();\n'+
    '</script>\n'+
    '<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>';
}
