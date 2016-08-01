// README
/*
    // Notes and Ideas
    // 1) Don't ever display the current post
    // 2) Don't display the same author more than X times
    // 3) Don't display a related post more than once per article (duh)
    // 4) Don't display a related post more than once per page (unless neccessary) 

    // Weight and Scoring for the Author/Category matches
    // 10 points = Sticky Post (featured)
    // 7  points = Same Author
    // 5  points = "Best of ..." category
    // 2  points = Each Category Match
    // 1  point  = Non C+C Guest Poster
*/

rpPluginSettings = {

    PluginEnabled: false,
    MaxCalls: 50,
    EnableAjaxCaching: true,
    TargetMatchLength: 4,
    Scores: {
        Sticky: 10,
        Author: 7,
        BestOf: 5,
        Category: 2,
        TeamWriter: 1
    },
    GuestPosterId: "53f58994e4b0a4359f9f0e7b",
    BestOfCat: "Best of C+C",
    MaxAuthorPosts: 2,
    ExemptAuthorId: "563ee68ee4b07f78f2d7fd5b",
    MaxPostDisplaysPerPage: 2,

    EnableCookie: function(name) {
        // enable 1 day cookie
        var d = new Date();
        d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=true; " + expires;
    },

    DisableCookie: function(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    },

    GetCookieFlag: function(name) {
        var name = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length) === "true";
            }
        }
        return false;
    },

    EnableDebug: function() {
        this.EnableCookie("rpDebug");
    },
    DisableDebug: function() {
        this.DisableCookie("rpDebug");
    },
    GetDebugFlag: function() {
        return this.GetCookieFlag("rpDebug");
    },
    EnablePlugin: function() {
        this.EnableCookie("rpEnabled");
    },
    DisablePlugin: function() {
        this.DisableCookie("rpEnabled");
    },
    GetEnabledFlag: function() {
        return this.GetCookieFlag("rpEnabled");
    }
}

rpPlugin = {

    Posts: [],
    PostedEssays: [],
    UniqueCategories: [],
    UniqueAuthors: [],
    TotalAjaxCalls: 0,
    Settings: {},

    // Functions
    InitRelatedPosts: function(settings) {

        this.Settings = settings;
        //if (settings.PluginEnabled === false)
        //    return;

        // Temporary while testing
        if (settings.GetEnabledFlag() === false)
            return;

        // logging off by default
        logger.disableLogger();

        var debugging = settings.GetDebugFlag();
        if (debugging) {
            logger.enableLogger();
        }

        // show the rp plugins
        $(".rp-related-posts")
            .addClass("enabled")
            .addClass(debugging ? "debug" : "");

        this.SetupAuthorsAndCategories();
        this.LoadAllRelatedPosts();

    },

    SetupAuthorsAndCategories: function() {

        var pageCategories = [];
        var pageAuthors = [];

        // For each article displayed, gather up the categories and authors
        $("article", $("#content-wrapper")).each(function() {

            // add categories
            $(this).find("footer div.categories a").map(function() {
                var cat = encodeURIComponent(this.text).replace(/%20/g, "+");
                pageCategories.push(cat);
            });
            // add authors
            $(this).find("header .article-byline .author a").map(function() {
                pageAuthors.push($(this).data("author-id"));
            });
        });

        // drill down to unique cats
        this.UniqueCategories = pageCategories.filter(function(item, i, ar) {
            return ar.indexOf(item) === i;
        });
        console.log("uniqueCats=" + this.UniqueCategories);

        // drill down to unique authors
        this.UniqueAuthors = pageAuthors.filter(function(item, i, ar) {
            return ar.indexOf(item) === i;
        });
        console.log("uniqueAuthors=" + this.UniqueAuthors);

    },

    LoadAllRelatedPosts: function() {

        // start to load all posts for the pages unique categories and authors
        var rpPromises = [];

        // get all posts from the unique categories
        for (i = 0; i < this.UniqueCategories.length; i++) {
            rpPromises.push(this.LoadRelatedPostsByUrl("/blog/?category=" + this.UniqueCategories[i] + "&format=json", true));
        }

        // get all posts from the unique authors
        for (i = 0; i < this.UniqueAuthors.length; i++) {
            rpPromises.push(this.LoadRelatedPostsByUrl("/blog/?author=" + this.UniqueAuthors[i] + "&format=json", true));
        }

        $.when.apply($, rpPromises).then($.proxy(function(results) {

            // need to figure out how to use the results from this;
            // for now just use the items added to the global array
            this.ProcessRelatedPosts();

        }, this), function() {
            // error occurred
            console.log("an error occurred while loading related posts")
        });

    },

    LoadRelatedPostsByUrl: function(url, enablePaging) {

        var that = this;

        if (that.TotalAjaxCalls > that.Settings.MaxCalls)
            return null;

        var req = $.ajax({
                url: url,
                type: "GET",

                // Required. boolean: localStorage will be used; otherwise an object that implements the Storage interface
                localCache: true,

                cacheTTL: 1, // Optional. In hours.
                cacheKey: url, // url is also the default
                isCacheValid: function() {
                    return that.Settings.EnableAjaxCaching;
                }
            })
            .then(function(data) {

                // combine posts with existing
                Array.prototype.push.apply(that.Posts, data.items)

                console.log("loaded " + data.items.length + " posts for " + url)

                // check for the next page and add the promise;
                // stop paging if we are at max capacity
                if (data.pagination && data.pagination.nextPage && enablePaging)
                    return that.LoadRelatedPostsByUrl(data.pagination.nextPageUrl + "&format=json", true);

                return data.items;

            });

        that.TotalAjaxCalls++;
        return req;
    },

    ProcessRelatedPosts: function() {

        console.log("total eligible posts:" + this.Posts.length);
        var that = this;

        $("article", $("#content-wrapper")).each(function() {

            var $currentArticle = $(this);
            var currentPostId = $currentArticle.data("item-id");
            var currentAuthorId = $("header .article-byline .author a", $currentArticle).first().data("author-id");
            debugger;

            var currentPost = $.map(that.Posts, function(item) {
                return item.id === currentPostId ? item : null;
            })[0];

            if (!currentPost || currentPost === undefined) {
                currentPost = that.RecoverMissingPosts(currentPostId, currentAuthorId);

                if (!currentPost || currentPost === undefined) {
                    console.log("Reload of new author content failed");
                    return;
                }
            }

            console.log("\nProcessing Post: " + currentPost.title);

            var relatedPostIds = [];

            // make a copy from the original list 
            // but only for the matching author and/or categories
            // and exclude current post plus duplicate posts
            var relatedPosts = $.map(that.Posts, function(post, idx) {
                var matchingCats = _.intersection(post.categories, currentPost.categories).length;
                if (
                    post.id !== currentPostId &&
                    !relatedPostIds.includes(post.id) &&
                    (post.authorId === currentAuthorId || matchingCats > 0)) {

                    // mark as read so we don't add it more than once
                    relatedPostIds.push(post.id);

                    // calculate the score
                    post.relativeScore =
                        0 +
                        (post.starred ? that.Settings.Scores.Sticky : 0) +
                        (post.authorId === currentAuthorId ? that.Settings.Scores.Author : 0) +
                        (post.categories.includes(that.BestOfCat) ? that.Settings.Scores.BestOf : 0) +
                        (matchingCats * that.Settings.Scores.Category) +
                        (post.authorId !== that.GuestPosterId ? that.Settings.Scores.TeamWriter : 0);

                    // add a property to randomize the sorting between posts with same score
                    post.randomSeed = Math.random();

                    console.log(post.relativeScore + " points for post " + post.title);
                    return post;
                }
                return null;
            });
            console.log("total unique posts: " + relatedPosts.length);

            // sort the posts by: relativeScore desc, randomSeed
            var orderedPosts =
                _.chain(relatedPosts)
                .sortBy("randomSeed") // less important sort first
                .sortBy("relativeScore").reverse() // most important sort last
                .value();

            var internalPosted = [];
            var internalAttempts = 0;

            // Now that posts are in order by scores, apply last set of rules to find the best 4 posts
            while (that.Settings.TargetMatchLength > internalPosted.length && internalAttempts < orderedPosts.length) {

                var post = orderedPosts[internalAttempts];
                internalAttempts++;

                // post check
                var matchingGlobalPosts =
                    _.filter(that.PostedEssays, function(postedEssay) {
                        return postedEssay.id === post.id;
                    });

                if (matchingGlobalPosts && matchingGlobalPosts.length >= that.Settings.MaxPostDisplaysPerPage) {
                    console.log("Essay " + post.title + " already used max times per page");
                    continue;
                }

                // author check
                if (post.authorId !== that.Settings.ExemptAuthorId) {
                    var matchingAuthorPosts =
                        _.filter(internalPosted, function(internalPostedEssay) {
                            return internalPostedEssay.authorId === post.authorId;
                        });

                    if (matchingAuthorPosts && matchingAuthorPosts.length >= that.Settings.MaxAuthorPosts) {
                        console.log("Author " + post.author.displayName + " already used max times per block");
                        continue;
                    }
                }

                internalPosted.push(post); // mark it now so we dont end up helplessly looping on errors
                that.PostedEssays.push(post); // enhancement to prevent post from showing up again

                that.AddRelatedPost(post, $currentArticle, internalPosted.length - 1);
            }

            if (internalPosted.length < that.Settings.TargetMatchLength) {
                console.log("Whoops! We ran out of posts!!");
                // hide the related posts widget for this article
                $(".rp-related-posts", $currentArticle)
                    .removeClass("enabled");
            }
        });

        return true;
    },

    AddRelatedPost: function(post, currentArticle, idx) {

        var parsed = $('<div/>').append(post.body);
        var imgSrc = $(parsed).find('.thumb-image').data('src');

        var summaryItem = $("footer", currentArticle).find(".summary-item").get(idx);

        // set img src
        // TODO: load this async and finish the rest once image is loaded
        if (imgSrc && imgSrc.length)
            $(".summary-thumbnail-image", summaryItem).first().attr("src", imgSrc.replace('http:', 'https:') + '?format=500w');

        // update anchor link href &
        // update anchor link data-title = {post.title}
        $(".summary-thumbnail-container", summaryItem)
            .first()
            .attr("href", post.fullUrl)
            .attr("data-title", post.title);

        // update summary title link full url
        // update summary title link inner text
        $(".summary-title-link", summaryItem)
            .first()
            .attr("href", post.fullUrl)
            .attr("title", post.title)
            .text(post.title);

        var publishMoment = moment(post.publishOn);

        // add time datetime="yyyy-mm-dd">
        // add time inner text i.e. "Jul 18, 2016"
        $(".summary-metadata-item--date", summaryItem)
            .first()
            .attr("datetime", publishMoment.format("YYYY-MM-DD"))
            .text(publishMoment.format("MMM DD, YYYY"));

        // add author link href to team member page (from bio)
        // add author link inner text = author display name
        $(".summary-metadata-item--author a", summaryItem)
            .first()
            .attr("href", post.author.websiteUrl)
            .text(post.author.displayName);

        // for debugging
        $(".summary-metadata-item--score", summaryItem)
            .first()
            .text(post.relativeScore);

        $(summaryItem).fadeIn();

    },

    RecoverMissingPosts: function(currentPostId, currentAuthorId) {

        console.log("Article " + currentPostId + " missing from collection; reload.");
        // if we don't find a post in the list, it means
        // the list was cached and this is new content;
        // clear the cache for this author and load first page again

        // reset ajax call count to make sure this one gets loaded
        this.TotalAjaxCalls = 0;

        var url = "/blog/?author=" + currentAuthorId + "&format=json";
        localStorage.clear(url);

        $.when(this.LoadRelatedPostsByUrl(url, false)).then($.proxy(function(data, textStatus, jqXHR) {

            console.log("Page 1 for author " + currentAuthorId + " reloaded");

            // locate post again
            return $.map(this.Posts, function(item) {
                return item.id === currentPostId ? item : null;
            })[0];

        }, this));

    }
}