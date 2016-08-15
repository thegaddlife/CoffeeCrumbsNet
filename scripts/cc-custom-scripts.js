 document.addEventListener("DOMContentLoaded", function(event) {

     // 1) Image header block swap (mimick promoted block from Native template)

     // get all post nodes
     var postNodes = document.querySelectorAll(".post");
     if (postNodes) {

         // loop through all post nodes
         Array.prototype.forEach.call(postNodes, function(postNode) {
             // see if this is an audio block; if so bounce
             var audioBlockNode = postNode.querySelector(".audio-block");
             if (audioBlockNode)
                 return;

             // find an image block
             var imageBlockNode = postNode.querySelector(".image-block");
             if (imageBlockNode) {
                 // find an image
                 var img = imageBlockNode.querySelector("img");
                 if (img && img.attributes.src != null) {
                     // move the image block above the header for the post
                     postNode.insertBefore(imageBlockNode, postNode.querySelector("header"));
                     // set the img to visible
                     imageBlockNode.style.visibility = "visible";
                 }
             }
         });
     }

     // 2) swap author links in summary block with custom author pages
     var authorLinkSwap = {
         "/?author=551c610ce4b0f86de559f9f5#show-archive": "lesley-miller",
         "/?author=55e26f05e4b09e1859652657#show-archive": "anna-jordan",
         "/?author=542cc758e4b07e808b11715e#show-archive": "callie-feyen",
         "/?author=53efc1eae4b0b8045113b6d3#show-archive": "anna-quinlan",
         "/?author=50312c9fe4b00d577d15a857#show-archive": "ashlee-gadd",
         "/?author=53efc1b4e4b00e67f7f132fc#show-archive": "suzy-krause",
         "/?author=542cc74fe4b07e808b11713e#show-archive": "april-hoss",
         "/?author=53efc22ce4b0a6d42412cf78#show-archive": "ntima-preusser",
         "/?author=53efc207e4b0b8045113b6e5#show-archive": "melanie-dale",
         "/?author=53efc217e4b0b8045113b707#show-archive": "katie-blackburn"
     };
     var teamLink = "/the-team/";

     // get the displayed author links
     var authorSelector = "#sidebar-one .summary-v2-block .summary-metadata-container--below-title .summary-metadata--primary .summary-metadata-item--author a";
     var authorLinkNodes = document.querySelectorAll(authorSelector);
     if (authorLinkNodes) {
         Array.prototype.forEach.call(authorLinkNodes, function(authorLinkNode) {
             var link = authorLinkNode.getAttribute("href");
             if (link in authorLinkSwap) {
                 authorLinkNode.setAttribute("href", teamLink + authorLinkSwap[link]);
             }
         });
     }

     var commentlinkSelector = ".cc-sharing-comments-jump";
     var commentsLinkNodes = document.querySelectorAll(commentlinkSelector);
     if (commentsLinkNodes) {
         Array.prototype.forEach.call(commentsLinkNodes, function(commentsLinkNode) {
             commentsLinkNode.addEventListener("click", function() {
                 console.debug("Alert!!!");
             });
             commentsLinkNode.removeEventListener("click", shareButtonClickHandler, false);
         });
     }

 });