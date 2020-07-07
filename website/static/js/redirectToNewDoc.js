/*
 * This code is not run through any build step! Don't add any fancy stuff
 */

(function() {
  var dontRedirect = [
    'playground'
  ]
  var specializedDocsRedirect = {
    'stdlib-overview': 'apis/javascript/latest',
    'community': 'community',
  }
  var specializedBlogRedirect = {
    '2017/10/01/announcing-1-0': 'bucklescript-release-1-0',
    '2017/10/02/release-1-4-2': 'bucklescript-release-1-4-2',
    '2017/10/03/release-1-4-3': 'bucklescript-release-1-4-3',
    '2017/10/04/release-1-5-0': 'bucklescript-release-1-5-0',
    '2017/10/05/release-1-5-1': 'bucklescript-release-1-5-1',
    '2017/10/06/release-1-5-2': 'bucklescript-release-1-5-2',
    '2017/10/07/release-1-7-0': 'bucklescript-release-1-7-0',
    '2017/10/08/release-1-7-4': 'bucklescript-release-1-7-4',
    '2017/10/09/release-1-7-5': 'bucklescript-release-1-7-5',
    '2018/04/16/release-3-0-0': 'bucklescript-release-3-0-0',
    '2018/05/21/release-3-1-0': 'bucklescript-release-3-1-0',
    '2018/05/23/release-3-1-4': 'bucklescript-release-3-1-4',
    '2018/07/17/release-4-0-0': 'bucklescript-release-4-0-0-pt1',
    '2018/07/17/release-4-0-0II': 'bucklescript-release-4-0-0-pt2',
    '2018/11/19/next-half': 'bucklescript-roadmap-q3-4-2018',
    '2018/12/05/release-4-0-8': 'bucklescript-release-4-0-8',
    '2019/01/07/release-4-0-17': 'bucklescript-release-4-0-17',
    '2019/03/1/feature-preview': 'feature-preview-variadic',
    '2019/03/21/release-5-0': 'bucklescript-release-5-0',
    '2019/03/31/release-6-0': 'bucklescript-release-6-0',
    '2019/04/09/release-schedule': 'bucklescript-release-5-0-1',
    '2019/04/22/release-5-0-4': 'bucklescript-release-5-0-4',
    '2019/06/26/release-5-0-5': 'bucklescript-release-5-0-5',
    '2019/08/12/release-5-10-0': 'bucklescript-release-5-10-0',
    '2019/09/23/release-5-20-0': 'bucklescript-release-5-20-0',
    '2019/11/18/whats-new-in-7': 'whats-new-in-7-pt1',
    '2019/12/20/release-7-02': 'bucklescript-release-7-0-2',
    '2019/12/27/whats-new-in-7-cont': 'whats-new-in-7-pt2',
    '2020/02/04/release-7-1-0': 'bucklescript-release-7-1-0',
    '2020/03/12/release-7-2': 'bucklescript-release-7-2',
    '2020/04/13/release-7-3': 'bucklescript-release-7-3',
    '2020/05/06/exception-encoding': 'a-story-of-exception-encoding',
  }

  var path = window.location.pathname.split('/');
  var blogPageFullPath = path.slice(2).join('/')
  var page = path[path.length - 1];

  if (path[1] === 'docs'
      && page != null
      // && page !== 'installation' uncomment to test more easily
      && dontRedirect.indexOf(page) === -1) {
    if (specializedDocsRedirect[page] == null) {
      window.location = 'https://reasonml.org/docs/reason-compiler/latest/' + path[3]
    } else {
      window.location = 'https://reasonml.org/' + specializedDocsRedirect[page]
    }
  } else if (path[1] === 'blog' && blogPageFullPath != null) {
    if (specializedBlogRedirect[blogPageFullPath] == null) {
      window.location = 'https://reasonml.org/blog/' + page
    } else {
      window.location = 'https://reasonml.org/blog/' + specializedBlogRedirect[blogPageFullPath]
    }
  }
})();
