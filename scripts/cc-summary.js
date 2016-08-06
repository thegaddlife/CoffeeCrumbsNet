$(function() {

    $(document).on("ready", function() {
        if (document.getElementById("cc-summary-item-clone") !== null)
            ccSummaryBlock2.InitPlugin();
    });

    $("#CCSummaryLoadMoreLink").on("click", function() {
        ccSummaryBlock2.LoadSummaryItems();
        return false;
    });

});

ccSummaryBlock2 = {

    ImagesPerBatch: 12,
    TotalLoadedThisBatch: 0,
    QueryType = "",
    QueryVal = "",
    NextPageUrl: "",
    LoadedPosts: [],

    InitPlugin: function() {
        this.QueryType = $("#CCSummaryBlock").data("cc-summary-query-type");
        this.QueryVal = $("#CCSummaryBlock").data("cc-summary-query-value");

        // first call
        this.LoadSummaryItems();
    },

    LoadSummaryItems: function() {

        debugger;

        var showMore = $("#CCSummaryLoadMoreLink");
        showMore.hide();

        var rpPromises = [];
        var url = this.NextPageUrl !== "" ? this.NextPageUrl : "/blog/?" + this.QueryType + "=" + this.QueryVal;
        rpPromises.push(this.LoadRelatedPostsByUrl(url + "&format=json"));

        $.when.apply($, rpPromises).then($.proxy(function(results) {

            this.ProcessSummaryBlock();

            // reset batch counter and loaded array
            this.TotalLoadedThisBatch = 0;
            this.LoadedPosts = [];

        }, this), function() {
            // error occurred
            console.log("an error occurred while loading related posts")
        });

        // return indication of whether there are more posts to display
        if (this.NextPageUrl !== "") {
            window.setTimeout(function() {
                showMore.fadeIn();
            }, 2000);
        }
    },

    LoadRelatedPostsByUrl: function(url) {

        var that = this;

        var req = $.ajax({
                url: url,
                type: "GET"
            })
            .then(function(data) {

                that.TotalLoadedThisBatch += data.items.length;
                alert(that.TotalLoadedThisBatch);

                Array.prototype.push.apply(that.LoadedPosts, data.items)

                var morePages = false;
                that.NextPageUrl = "";
                if (data.Pagination && data.pagination.nextPageUrl) {
                    morePages = true;
                    that.NextPageUrl = data.pagination.nextPage;
                }

                // check for the next page and add the promise;
                // stop paging if we are at max capacity
                if (morePages && that.TotalLoadedThisBatch < that.ImagesPerBatch)
                    return that.LoadRelatedPostsByUrl(that.NextPageUrl + "&format=json");

                return data.items;

            });

        return req;
    },

    ProcessSummaryBlock: function() {
        alert(this.LoadedPosts.length);
        alert(this.NextPageUrl);
    },

    AddSummaryItem: function(post, num) {

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
        post.categories.forEach(function logArrayElements(element, index, array) {
            var cat = encodeURIComponent(element).replace(/%20/g, "+");
            $('<a class="cc-summary-cat-link" href="/?category=' + cat + '">' + element + '</a>')
                .appendTo(catLinks);
        });

        summaryItem.appendTo("#cc-summary-block-item-list");

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
                summaryItem.fadeIn();
            };
            downloadingImage.src = imgSrc + '?format=700w';

        }
    }

}