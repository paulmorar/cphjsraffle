import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import RaffleForm from "./raffle/form";
import RafflePicker from "./raffle/picker";
import registerServiceWorker from "./registerServiceWorker";

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

var urlParams = getUrlVars();

switch (urlParams["startPage"]) {
  case "raffle":
    ReactDOM.render(<RafflePicker />, document.getElementById("root"));
    break;

  default:
    ReactDOM.render(<RaffleForm />, document.getElementById("root"));
    break;
}

registerServiceWorker();
