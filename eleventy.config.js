import logToConsole from 'eleventy-plugin-console-plus'
import _ from 'lodash'

export default (eleventyConfig) => {
  // Add eleventy-plugin-console-plus for better logging
  eleventyConfig.addPlugin(logToConsole,{depth: 2 });

 // Create an arary of authors
  eleventyConfig.addCollection("authors", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");
    let authors = new Set();
    posts.forEach( (post) => {
      authors.add(post.data.author)
    })
    return [...authors];
  });

  // create a chuncked collection of posts for each author
  eleventyConfig.addCollection("authorsPosts", function (collectionApi) {
    // Get all posts
    const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

    // Create an arary of authors
    let authors = new Set();
    posts.forEach( (post) => {
      authors.add(post.data.author)
    })
    const authorsArray = [...authors];
   
    let paginationSize = 2; // number of posts per page
    let authorMap = [];

    // loop through each author
    for( let authorName of authorsArray) {
      // Get the posts for this author
      let authorPosts = posts.filter( (post) => post.data.author === authorName)
     
      // chink the posts for this author
      let pagedItems = _.chunk(authorPosts, paginationSize);

      // add each chunk to authorMap
      for( let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
        authorMap.push({
          authorName: authorName,
          pageNumber: pageNumber,
          totalPages: pagedItems.length,
          pageData: pagedItems[pageNumber]
        });
      }
    }
    return authorMap
  });

};

export const config = {
  htmlTemplateEngine: "njk",
  dir: {
    input: "src",
    output: "dist"
  },
};

