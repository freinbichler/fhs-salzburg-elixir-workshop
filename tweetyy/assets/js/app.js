// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

const template = (tweet) => {
  return `
    <li>
      <p><span class="score">${tweet.score}</span> ${tweet.body}</p>
    </li>
  `
}

const listElement = document.querySelector(".js-tweet-list");
const averageElement = document.querySelector(".js-average-score");

let scores = [];

window.startTermStream = (term) => {
  let channel = socket.channel(`tweet_stream:${term}`, {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) })

  channel.on("tweet:new", (tweet) => {
    listElement.innerHTML = template(tweet) + listElement.innerHTML;
    window.calculateAverageScore(tweet.score);
  })
}

window.calculateAverageScore = (score) => {
  scores.push(score);
  const averageScore = scores.reduce((p, c) => p + c, 0 ) / scores.length;
  averageElement.innerHTML = Math.round(averageScore * 10) / 10;
}
