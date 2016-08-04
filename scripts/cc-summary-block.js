$(function() {

    $(document).on("ready", function() {
        alert(posts.length);
        //LoadImageBatch();
    });

    $("#CCSummaryBlockLoadMoreLink").on("click", function() {
        $(this).hide();
        if (ccSummaryBlock.LoadImageBatch()) {
            $(this).show();
        }
    });

})

ccSummaryBlock = {

    ImageCount: 9,

    LoadImageBatch: function(count) {

        // find next {count} hidden summary-items
        var hiddenSummaryItems = $(".summary-item:hidden", $(".cc-summary-block"));

        // loop over them and load their images

        // return indication of whether there are more posts hidden
        return hiddenSummaryItems.length > count;
    },

    LoadImage: function(post) {

        // parse out the img src
        var startIdx = post.body.indexOf("<noscript><img src=") + 20;
        var endIdx = post.body.indexOf("</noscript>", startIdx) - 5;
        var imgSrc = post.body.substring(startIdx, endIdx);

        var image = $("#ccSummaryBlock-image-" + postId);

        var downloadingImage = new Image();
        downloadingImage.onload = function() {
            image.src = this.src;
            // fade in
        };
        downloadingImage.src = imgSrc;

    }

}