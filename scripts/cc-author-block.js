$(function() {

    $(document).on("ready", function() {
        var ccAuthorBlock = $("#cc-author-block-wrapper");
        if (ccAuthorBlock.length)
            ccAuthorBlock2.LoadAuthor();
    });

});

var ccAuthorBlock2 = {

    WriterIds: [
        "53efc207e4b0b8045113b6e5"
    ],

    LoadAuthor: function() {

        // get author id
        var authorId = $("#essay-author-link").data("author-id");;

        if (authorId === "" || this.WriterIds.includes(authorId) === false)
            return;

        var that = this;

        $.ajax({
            url: "/the-team?author=" + authorId + "&format=json",
            type: "GET",
            async: false
        }).done(function(data) {
            if (data.items.length === 1)
                that.SetAuthor(data.items[0]);
        });

        // Call CC Summary block
        ccSummaryBlock2.ShowLoading = false;
        ccSummaryBlock2.ImagesPerBatch = 4;
        ccSummaryBlock2.QueryType = "author";
        ccSummaryBlock2.QueryVal = authorId;
        ccSummaryBlock2.LoadSummaryItems();
    },

    SetAuthor: function(author) {

        // image
        var $img = $("#cc-author-image");
        var imgUrl = author.assetUrl;
        $img
            .data("src", imgUrl)
            .data("image", imgUrl)
            .attr("src", imgUrl + "?format=300w");

        // excerpt
        $("#cc-author-excerpt").html(author.excerpt);

        // social links

    }

}