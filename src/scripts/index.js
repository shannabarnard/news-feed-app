import '../styles/index.scss';
import './animations';
import axios from "axios";

//global states
let currentData = {};
let filteredData = [];

//fethcing initial data
function fetchData() {
  axios
    .get(
      "https://cors-anywhere.herokuapp.com/https://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion.js"
    )
    .then(async (res) => {
      console.log("in");
      //changing the format of the string
      let splitString = res.data.split("NYTD.render_section_front(");
      let slicedString = splitString[1].slice(0, -2);

      //converting to JSON
      currentData = JSON.parse(slicedString);
      console.log(currentData);

      //looping through the content objs
      for (
        let contentObj = 0;
        contentObj < currentData.page.content.length;
        contentObj++
      ) {
        // console.log(contentObj);
        //looping through the collection objs

        for (
          let collectionObj = 0;
          collectionObj <
          currentData.page.content[contentObj].collections.length;
          collectionObj++
        ) {
          //checking if the assets length is not zero
          if (
            currentData.page.content[contentObj].collections[collectionObj]
              .assets.length != 0
          )
            //looping through the assest objs
            for (
              let post = 0;
              post <
              currentData.page.content[contentObj].collections[collectionObj]
                .assets.length;
              post++
            ) {
              //assiging the current post
              const currentPost =
                currentData.page.content[contentObj].collections[collectionObj]
                  .assets[post];

              let postObj = {};
              if (currentPost.images != undefined) {
                console.log(currentPost.images[0]);

                postObj = {
                  headline: currentPost.headline,
                  publishedDate: currentPost.publicationDt,
                  summarry: currentPost.summary,
                  url: currentPost.url,
                  byline: currentPost.byline,
                  image:
                    currentPost.images.length == 0
                      ? "https://static01.nyt.com/images/2020/12/15/world/15china-uighur1/15china-uighur1-mediumThreeByTwo210.jpg?quality=100&auto=webp"
                      : `https://www.nytimes.com/${currentPost.images[0].types[0].content}`,
                };
              }

              //pushing to global state
              if (
                postObj.headline != undefined &&
                postObj.headline != "" &&
                postObj.byline != undefined &&
                postObj.publishedDate != undefined
              )
                filteredData.push(postObj);
            }
        }
      }
      let postsContainer = document.getElementById("article__content");
      //adding posts to the UI
      filteredData.map((item, key) => {
        //adding date
        let rootDate = document.createElement("div");
        rootDate.classList.add("article__content--left");
        let childDate = document.createElement("div");
        childDate.classList.add("last-published");
        childDate.innerHTML = item.publishedDate;
        rootDate.appendChild(childDate);

        postsContainer.appendChild(rootDate);

        //center node
        let rootCenter = document.createElement("div");
        rootCenter.classList.add("article__content--center");

        //sub center nodes
        //adding heading
        let rootHeading = document.createElement("div");
        rootHeading.classList.add("headline");
        let subChildHeading = document.createElement("h2");
        subChildHeading.innerHTML = item.headline;
        rootHeading.appendChild(subChildHeading);
        rootCenter.appendChild(rootHeading);

        //adding summary
        let rootSummary = document.createElement("div");
        rootSummary.classList.add("summary");
        let childSummary = document.createElement("p");
        childSummary.innerHTML = item.summarry;
        rootSummary.appendChild(childSummary);
        rootCenter.appendChild(rootSummary);

        //adding author
        let rootAuthor = document.createElement("div");
        rootAuthor.classList.add("byline");
        rootCenter.appendChild(rootAuthor);

        postsContainer.appendChild(rootCenter);

        //adding image
        let rootImage = document.createElement("div");
        rootImage.classList.add("article__content--right");
        let childImage = document.createElement("div");
        childImage.classList.add("image-thumb-wide");
        let subChildImage = document.createElement("img");
        subChildImage.src = item.image;
        childImage.appendChild(subChildImage);
        rootImage.appendChild(childImage);
        rootCenter.appendChild(rootImage);
        postsContainer.appendChild(rootImage);
      });
      console.log(filteredData);
    })

    .catch((err) => {
      console.log(err);
    });
}

fetchData();
