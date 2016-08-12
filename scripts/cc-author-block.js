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
        ccSummaryBlock2.ImagesPerBatch = 3;
        ccSummaryBlock2.QueryType = "author";
        ccSummaryBlock2.QueryValue = authorId;
        ccSummaryBlock2.LoadSummaryItems();
    },

    SetAuthor: function(author) {

        // image

        // excerpt

        // social links

    }

}