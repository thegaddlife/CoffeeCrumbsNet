$(function() {

    $(document).on("ready", function() {
        if (document.getElementById("cc-summary-item-clone") !== null)
            ccSummaryBlock2.LoadSummaryItems();
    });

    $("#CCSummaryBlockLoadMoreLink").on("click", function() {
        ccSummaryBlock2.LoadSummaryItems();
        return false;
    });

});

ccSummaryBlock2 = {

    ImagesPerBatch: 12,
    NextPageUrl: "",

    LoadSummaryItems: function() {

        var showMore = $("#CCSummaryBlockLoadMoreLink");
        showMore.hide();

        this.NextPageUrl = "#SomeLink";

        // return indication of whether there are more posts to display
        if (this.NextPageUrl !== "") {
            window.setTimeout(function() {
                showMore.fadeIn();
            }, 2000);
        }
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