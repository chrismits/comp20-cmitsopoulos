request = new XMLHttpRequest();
request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

var dataObj = null;
var temp;
request.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		dataObj = JSON.parse(this.responseText);
		userMarkers();
	}
}
request.send("login=uKLkLPxv&lat=" + lat + "&lng=" + lng);

//create markers for people
function userMarkers() {
	for (i = 0; i < dataObj.people.length; ++i) {
		theirLat = dataObj.people[i].lat;
		theirLng = dataObj.people[i].lng;
		var location = new google.maps.LatLng(theirLat, theirLng)
		var marker = new google.maps.Marker({
			position: location,
			title: "Other location",
		});
		marker.setMap(map);
	}
}