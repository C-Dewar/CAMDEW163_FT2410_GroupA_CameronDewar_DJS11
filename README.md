My Podcast Application: CAMDEW163_FT2410_GroupA_CameronDewar_DJS11

For my podcast application, I've made use of the following dependencies:
I Created my application through the use of React + Vite and have done the vast majority of my code using a combination of Typescript,
JavaScript, and css modules for styling. I have some innate react features and imported some additional elements like zustand for state management and date-fns for date management to prevent the need for complex javascript logic for date handling - even though I've kept the display of the date relatively rudimentary/short to reduce clutter and unnecessary specificity.

My dependencies list is therefore as follows:
React,
React-router-dom,
Vite,
Zustand,
date-fns.

I made use of absolute references by modifying my tsconfig.app.json to ensure that I use as few local references as possible for practicality.

In terms of the applications functionality,

- The application defaults to loading on a "Home" page which is path "/" and contains a list of all of the shows returned by the API call

The user is able to sort the shows on both my Home and Favourites (Provided episodes within favourites exist) via the sorting util hook:

The sorting hook allows the user to sort:

- from A-Z (default), (Z-A) - Uses alphabetical sorting within a switch statement i.e. toLocaleCompare
- or by Recent updates and Oldest updates which gets the date and makes use of

The Filtering hook is only utilised within the Home page:

- it sorts the shows by genre based off a map of the provided genres compared to the numerical value for genre which is contained within the
  genre key of the shows object returned by that initial API call.

  ShowDetails:

- Once a show is clicked, the Seasons and Episodes corresponding to that ShowId are loaded on the ShowDetails page/render. The user is capable
  of navigating through the available episodes by clicking the desired season which shows the contained episodes and then they can mount the selected episode to and launch the audioplayer to play that specific episode.
- Progress is tracked and displayed on that page, whether or not the episode has been finished is tracked, and a play/listen count is also
  tracked and updated/incremented by +1 whenever an episode has been completely listened to. The isFinished functionality resets the episode back to the start (0) and the isFinished status resets after the listen count has been incremented by 1, thereby allowing the user to listen to a track multiple times and use the Listen count as a reference if they are listening to it again.

  Favourites:

- The user can also add that episode to favourites which then creates a shallow copy of that episode and ammends it to the favourites array
  using a unique composite id for the specific episode.
- I implemented a burger menu that allows for navigation between the home and favourites page depending on which page is currently displayed.
  The episode can be either added or removed from the ShowDetails page, but can only be removed via the Favourites page.
  The favourite episodes are stored to localStorage so that they remain within the user data.
- The user can either remove the show individually from the favourites page or they can clear all local storage from the burger menu dropdown
  to toally reset any user specific interaction/tracking stored within the application.

  Burger Menu css from:

  - raw css & javaScript credit: https://codepen.io/joesayegh/pen/jOEVPKO

  Background image from:

  - pexels-elijahsad
