$(function() {

    $(document).on("ready", function() {
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

    LoadImage: function(postId) {

        // go grab the post
        var post = {};

        // find the image from the post body
        var parsed = $('<div/>').append(post.body);
        var imgSrc = $(parsed).find('.thumb-image').data('src');

        var image = $("#ccSummaryBlock-image-" + postId);
        var downloadingImage = new Image();
        downloadingImage.onload = function() {
            image.src = this.src;
            // fade in
        };
        downloadingImage.src = imgSrc;

    }

}