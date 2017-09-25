var map;
var infowindow;
var places;
var service;
var address=[];
var markers=[];

function initMap() {
  var center = {lat: 49.2827, lng: -123.1207};

  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15
  });

  var request1 = {
    location: center,
    radius: 800,
    type: ['restaurant']
  };

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request1, callback1);
  
}

function callback1(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    places = results;
    places.forEach(createMarker);
  }
  ko.applyBindings(new placesListModel());
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    icon: {
      url: 'http://maps.gstatic.com/mapfiles/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    },
    position: place.geometry.location
  });

  var request2 = {placeId: place.place_id};
  marker.addListener('click', function(){
    service.getDetails(request2, callback2);
    map.setZoom(16);
    map.setCenter(marker.getPosition());
  });

  markers.push(marker);

  function callback2(details, status){
    if (status === google.maps.places.PlacesServiceStatus.OK){
      infowindow.setContent([
      details.name,
      details.formatted_address,
      details.website,
      details.rating,
      details.formatted_phone_number].join("<br />"));
      infowindow.open(map, marker); 
    }  
  }
}

function placesListModel(){
  self = this;
  self.items = ko.observableArray(places);
  self.itemClicked = function(index){
    google.maps.event.trigger(markers[index], 'click');
  };
  self.query = ko.observable("");
  self.filteredData = ko.computed(function(){
    var filter = self.query().toLowerCase();
    if(!filter){
      return self.items();
    }
    else{
      return ko.utils.arrayFilter(self.items(), function(item){
        return item.name.toLowerCase().indexOf(filter) !== -1;
      });
    }
  }); 
}



