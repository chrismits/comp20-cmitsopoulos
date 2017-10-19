//Credit to comp20 examples in github.com/tuftsdev

lat = 42.40685441146812;
lng = -71.11905097961426;
var me;
var map;
var infoWindow;
var myMarker = 'me.png';
var lm = 'landmarker.png';

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: {lat, lng},
	});
	getLocation();
}

function getLocation() 
{
	if (navigator.geolocation) 
	{
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			lng = position.coords.longitude;

			render();
		});
	}
	else
		alert("Geolocation not supported in this browser!");
}

function showInfoWindow(marker) {
	google.maps.event.addListener(marker, 'click', function () {
	                    infoWindow.setContent(this.info);
	                    infoWindow.open(map, this);
	                });
}

function render() {
	me = new google.maps.LatLng(lat, lng);
	map.panTo(me);

	// Create a marker
	var marker = new google.maps.Marker({
		position: me,
		animation: google.maps.Animation.DROP,
		title: "My Location",
		icon: myMarker,
		info: "My Location"
	});

	infoWindow = new google.maps.InfoWindow({});
	showInfoWindow(marker);
	marker.setMap(map);
	getServerData();
}

function getServerData()
{
	request = new XMLHttpRequest();
	request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	dataObj = null;
	var temp;
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			dataObj = JSON.parse(this.responseText);
			console.log(dataObj);
			userMarkers();
			lmMarkers();
		}
	}
	request.send("login=uKLkLPxv&lat=" + lat + "&lng=" + lng);
}

//Snippet taken from https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
function getDistance(p1, p2) {
	var rad = function(x) {
		return x * Math.PI / 180;
	};
	var R = 6378137; // Earth’s mean radius in meter
	var dLat = rad(p2.lat() - p1.lat());
	var dLong = rad(p2.lng() - p1.lng());
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
	Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	d = d * 0.000621371;
	d = d.toFixed(5);
	return d; // returns the distance in miles
}

//create markers for people
function userMarkers() {
	// console.log(lat == 42.40685441146812);
	// console.log(lng == -71.11905097961426);

	var myLocation = new google.maps.LatLng(lat, lng);

	for (i = 0; i < dataObj.people.length; ++i) {
		theirLat = dataObj.people[i].lat;
		theirLng = dataObj.people[i].lng;
		var location = new google.maps.LatLng(theirLat, theirLng);
		var dist = getDistance(location, myLocation)
		var usermarker = new google.maps.Marker({
			position: location,
			title: "Other location",
			info: "<b> Login: </b>" + dataObj.people[i].login
			+ "<br> <b> Distance from you: </b>" + dist + " miles"
		});
		usermarker.setMap(map);
		showInfoWindow(usermarker);
	}
}

//markers for landmarks
function lmMarkers() {
	for (k = 0; k < dataObj.landmarks.length; ++k) {
		landLat = dataObj.landmarks[k].geometry.coordinates[1];
		landLng = dataObj.landmarks[k].geometry.coordinates[0];
		var landloc = new google.maps.LatLng(landLat, landLng);
		var landmarker = new google.maps.Marker({
			position: landloc,
			title: "Landmark Location",
			icon: lm,
			info: dataObj.landmarks[k].properties.Details
		});
		landmarker.setMap(map);
		showInfoWindow(landmarker);
	}
}




