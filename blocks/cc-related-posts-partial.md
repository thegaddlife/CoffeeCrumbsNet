Items Changed

+ related-posts-partial.block

+ related-post-partial.block

+ related-posts-final.js

+ related-posts-partial.css

+ author-block.css

+ ss-logger.js

~ blog.item

~ blog.list

~ author-block.block

~ header.region

~ footer.region
- Added the squarespace:script block for the new js file
- Make sure to change back to combo="true" when done testing

~ template.conf

~ Website Footer Injection code

```javascript
<script type="text/javascript">
  /*
  	related posts setup
  */
  (function() {
    // check if this page has any related post blocks to configure  	
    if (document.getElementsByClassName("rp-related-posts").length > 0) {
    	  
      // turn on rp plugin and init
      rpPluginSettings.PluginEnabled = true;
      // set any custom settings different than defaults
      //rpPluginSettings.EnableAjaxCaching = false;
      rpPluginSettings.MaxPostDisplaysPerPage = 3;
      window.rpPlugin.InitRelatedPosts(rpPluginSettings);
    }
  })();
</script>
```