//Credit to comp20 examples in github.com/tuftsdev

lat = 42.40685441146812;
lng = -71.11905097961426;
var me;
var map;

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

function render() {
	me = new google.maps.LatLng(lat, lng);
	map.panTo(me);

	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		animation: google.maps.Animation.DROP,
		title: "My Location"
	});
	marker.setMap(map);
}