import '../styles/index.scss';
import './animations';
import axios from "axios";

//global states
let currentData = {};
let currentLanguage = "English";
let filteredData = [];
let putFilteredData = true;

//fethcing initial data
function fetchData() {
  axios
    .get(
      "https://cors-anywhere.herokuapp.com/https://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion.js"
    )
    .then(async (res) => {
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

//change language
window.changeLanguage = function () {
  console.log("in");
  let englishData = [];
  if (putFilteredData) englishData = filteredData;
  let martianData = [];

  //unchecking for later usage
  putFilteredData = false;

  //states for handling conversions
  let currentHeadline = [];
  let currentSummary = [];
  let currentByline = [];

  if (currentLanguage == "English") {
    currentLanguage = "Martian";

    if (martianData.length == 0) {
      //replacing to martian
      for (let i = 0; i < filteredData.length; i++) {
        //state level variables
        //turning strings into arrays
        currentHeadline = filteredData[i].headline.split(" ");
        currentSummary = filteredData[i].summarry.split(" ");
        currentByline = filteredData[i].byline.split(" ");
        // console.log(currentHeadline);
        //checking for headlines
        for (let count = 0; count < currentHeadline.length; count++) {
          if (currentHeadline[count].length > 3) {
            if (
              currentHeadline[count][0] ==
              currentHeadline[count][0].toUpperCase()
            ) {
              currentHeadline[count] = "Boinga";
            } else {
              currentHeadline[count] = "boinga";
            }
          }
        }

        //checking for summary
        for (let count = 0; count < currentSummary.length; count++) {
          if (currentSummary[count].length > 3) {
            if (
              currentSummary[count][0] == currentSummary[count][0].toUpperCase()
            ) {
              currentSummary[count] = "Boinga";
            } else {
              currentSummary[count] = "boinga";
            }
          }
        }

        //checking for by line
        for (let count = 0; count < currentByline.length; count++) {
          if (currentByline[count].length > 3) {
            if (
              currentByline[count][0] == currentByline[count][0].toUpperCase()
            ) {
              currentByline[count] = "Boinga";
            } else {
              currentByline[count] = "boinga";
            }
          }
        }

        currentHeadline = currentHeadline.join(" "); //Create a new string of the words separated by spaces.
        currentSummary = currentSummary.join(" "); //Create a new string of the words separated by spaces.
        currentByline = currentByline.join(" "); //Create a new string of the words separated by spaces.

        //assigning inside an object
        const obj = {
          headline: currentHeadline,
          summarry: currentSummary,
          byline: currentByline,
          publishedDate: filteredData[i].publishedDate,
          url: filteredData[i].url,
          image: filteredData[i].image,
        };
        martianData.push(obj);
      }
    }
    console.log(martianData);

    //removing the already present nodes
    let postsContainer = document.getElementById("article__content");
    while (postsContainer.hasChildNodes()) {
      postsContainer.removeChild(postsContainer.lastChild);
    }

    //adding martian nodes to the UI
    martianData.map((item, key) => {
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
  } else {
    //removing the already present nodes
    let postsContainer = document.getElementById("article__content");
    while (postsContainer.hasChildNodes()) {
      postsContainer.removeChild(postsContainer.lastChild);
    }
    currentLanguage = "English";
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
  }
};

fetchData();
