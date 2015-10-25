(function (window) {

  window.initMap = function() {
    var myLatLng = {lat: 59.936115, lng: 30.320985};

    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: myLatLng,
      disableDefaultUI: true
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: "img/map-marker.svg"
    });
  }

})(window);