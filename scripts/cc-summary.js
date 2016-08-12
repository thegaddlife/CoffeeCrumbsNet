$(function() {

    $(document).on("ready", function() {
        var ccSummaryBlock = $("#CCSummaryBlock");
        if (ccSummaryBlock.length && ccSummaryBlock.attr("data-cc-load-item") === "true") {

            ccSummaryBlock2.QueryType = ccSummaryBlock.data("cc-summary-query-type");
            ccSummaryBlock2.QueryVal = ccSummaryBlock.data("cc-summary-query-value");
            ccSummaryBlock2.LoadSummaryItems();
        }
    });

});

$(function() {

    $("#CCSummaryLoadMoreLink").on("click", function() {
        if (ccSummaryBlock2.IsLoading === false)
            ccSummaryBlock2.LoadSummaryItems();
        return false;
    });

});

var ccSummaryBlock2 = {

    IsLoading: true,
    ShowLoading: true,
    LoadingText: "Loading Essays ...",
    LoadMoreText: "Load More Essays",
    ImagesPerBatch: 12,
    TotalLoadedThisBatch: 0,
    QueryType: "",
    QueryVal: "",
    NextPageUrl: "",
    LoadedPosts: [],
    ShowMoreLink: $("#CCSummaryLoadMoreLink"),

    LoadSummaryItems: function() {

        this.IsLoading = true;
        if (this.ShowLoading === true)
            this.ShowMoreLink.fadeIn().find("#EssaysLoadingText").text(this.LoadingText);

        var rpPromises = [];
        var url = this.NextPageUrl !== "" ? this.NextPageUrl : "/blog/?" + this.QueryType + "=" + this.QueryVal;
        rpPromises.push(this.LoadRelatedPostsByUrl(url + "&format=json"));

        $.when.apply($, rpPromises).then($.proxy(function(results) {

            this.ProcessSummaryBlock();

        }, this), function() {
            // error occurred
            console.log("an error occurred while loading related posts")
        });

    },

    LoadRelatedPostsByUrl: function(url) {

        var that = this;

        var req = $.ajax({
                url: url,
                type: "GET"
            })
            .then(function(data) {

                if (data.items) {

                    that.TotalLoadedThisBatch += data.items.length;
                    Array.prototype.push.apply(that.LoadedPosts, data.items)

                    var morePages = false;
                    that.NextPageUrl = "";
                    if (data.pagination && data.pagination.nextPageUrl) {
                        morePages = true;
                        that.NextPageUrl = data.pagination.nextPageUrl;
                    }

                    // check for the next page and add the promise;
                    // stop paging if we are at max capacity for this load
                    if (morePages && that.TotalLoadedThisBatch < that.ImagesPerBatch)
                        return that.LoadRelatedPostsByUrl(that.NextPageUrl + "&format=json");

                    return data.items;
                }

            });

        return req;
    },

    ProcessSummaryBlock: function() {

        // loop over this.LoadedPosts; stop adding summary items
        // for this block if the max has been met
        for (i = 0; i < this.LoadedPosts.length; i++) {
            if (i < this.ImagesPerBatch)
                this.AddSummaryItem(this.LoadedPosts[i]);
        }

        // reset batch counter and loaded array
        this.TotalLoadedThisBatch = 0;
        this.LoadedPosts = [];
        this.IsLoading = false;

        // return indication of whether there are more posts to display
        if (this.NextPageUrl !== "" && this.ShowLoading === true)
            this.ShowMoreLink.find("#EssaysLoadingText").text(this.LoadMoreText);
        else
            this.ShowMoreLink.fadeOut();

    },

    AddSummaryItem: function(post) {

        var summaryItem = $("#cc-summary-item-clone").clone(true);

        summaryItem.removeAttr("id");

        // update summary title link full url
        // update summary title link inner text
        $(".summary-title-link", summaryItem)
            .first()
            .attr("href", post.fullUrl)
            .attr("title", post.title)
            .text(post.title);

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

        // add category links
        var catLinks = $(".summary-metadata-item--cats", summaryItem);
        post.categories.forEach(function processCategory(element, index, array) {
            // strip out + and &
            var cat = element.replace("+", "").replace("&", "").toLowerCase();
            // replace space in URI with a dash; also double dash with single
            // for cases where ampersand is removed between two spaces
            cat = encodeURIComponent(cat).replace(/%20/g, "-").replace("--", "-");
            $('<a class="cc-summary-cat-link" href="/category/' + cat + '">' + element + '</a>')
                .appendTo(catLinks);
        });

        summaryItem
            .appendTo("#cc-summary-block-item-list")
            .fadeIn();;

        // async load of the img
        var startIdx = post.body.indexOf("<noscript><img src=") + 20;
        var endIdx = post.body.indexOf("</noscript>", startIdx) - 5;
        var imgSrc = post.body.substring(startIdx, endIdx).replace('http:', 'https:');

        if (imgSrc && imgSrc.length) {

            var image = $(".summary-thumbnail-image", summaryItem).first();
            image
                .attr("data-src", imgSrc)
                .attr("data-image-dimensions", "800x535");

            var downloadingImage = new Image();
            downloadingImage.onload = function() {
                image.attr("src", this.src);
            };
            downloadingImage.src = imgSrc + '?format=700w';

        }
    }

}