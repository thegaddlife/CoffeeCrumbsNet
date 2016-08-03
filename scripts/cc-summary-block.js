ccSummaryBlock = {

    LoadImageBatch: function(count) {

        // find next {count} hidden summary-items


    },

    LoadImage: function(summaryItemId) {

        var postBody = $(".hidden-post-body", $("#" + summaryItemId)).first().val();
        var parsed = $('<div/>').append(postBody);
        var imgSrc = $(parsed).find('.thumb-image').data('src');

        // set the imgSrc async

        if (imgSrc && imgSrc.length) {
            var img = $(".summary-thumbnail-image", $("#" + id)).first();
            img.attr("src", imgSrc.replace('http:', 'https:') + '?format=7500w');
        }


    }

}