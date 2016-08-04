$(function() {

    $(document).on("ready", function() {
        if (document.getElementById("summary-item-clone") !== null)
            ccSummaryBlock.LoadSummaryItems();
    });

    $("#CCSummaryBlockLoadMoreLink").on("click", function() {
        ccSummaryBlock.LoadSummaryItems();
        return false;
    });

});

ccSummaryBlock = {

    ImagesPerBatch: 25,

    LoadSummaryItems: function() {

        var showMore = $("#CCSummaryBlockLoadMoreLink");
        showMore.hide();

        // any posts left?
        if (!posts || posts.length === 0)
            return false;

        // TODO: custom ordering and sorting here
        // similar to the related posts algorithm

        var processed = 0;
        while (processed < this.ImagesPerBatch) {
            processed++;
            var post = posts[0]; // get first element
            this.AddSummaryItem(post, processed);
            posts = posts.slice(1); // remove it
        }

        //alert("Remaining: " + posts.length);

        // return indication of whether there are more posts to display
        if (posts.length > 0)
            showMore.fadeIn();
    },

    AddSummaryItem: function(post, num) {

        debugger;

        var summaryItem = $("#summary-item-clone").clone(true);
        summaryItem.attr("id", "summary-item-" + post.id);

        if (num % 3 === 0)
            summaryItem.css("margin-right", "0");
        else if (num === 1)
            summaryItem.addClass("sqs-active-slide");

        // update summary title link full url
        // update summary title link inner text
        $(".summary-title-link", summaryItem)
            .first()
            .attr("href", post.fullUrl)
            .attr("title", post.title)
            .text(post.title);

        var startIdx = post.body.indexOf("<noscript><img src=") + 20;
        var endIdx = post.body.indexOf("</noscript>", startIdx) - 5;
        var imgSrc = post.body.substring(startIdx, endIdx).replace('http:', 'https:');

        if (imgSrc && imgSrc.length) {
            $(".summary-thumbnail-image", summaryItem)
                .first()
                .attr("src", imgSrc + '?format=700w')
                .attr("data-src", imgSrc)
                .attr("data-image-dimensions", "800x535");
        }

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
        debugger;
        $(".summary-metadata-item--author a", summaryItem)
            .first()
            .attr("href", post.author.websiteUrl)
            .text(post.author.displayName);

        summaryItem.appendTo("#cc-summary-block-item-list");
    }

}