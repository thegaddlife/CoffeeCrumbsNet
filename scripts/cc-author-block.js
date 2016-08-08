$(function() {

    $(document).on("ready", function() {
        var ccAuthorBlock = $(".author-block:visible");
        if (ccAuthorBlock.length)
            alert('author');
    });

});