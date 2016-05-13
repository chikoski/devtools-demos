var counter;

onmessage = function(e) {
  console.log("Message received from main script");
  counter = (counter || 0) + 1;
  console.log("new value: " + counter);
  postMessage(counter);
}
