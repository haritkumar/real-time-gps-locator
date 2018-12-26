<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
    <title>Live Geo Location</title>
    <style>
    #map{
        opacity: 1!important;
        border-radius: 5px;
        box-shadow: 0 0 6px #B2B2B2;
        color: #000;
    }
    </style>
  </head>
  <body>
    
    <div class="container-fluid">
    		<div class="row">
    			<div class="col-3">
    				<div class="row">
    					<div class="col-2">
    					 <img src="/earth.gif" style="max-width: 55px;"/>
    					</div>
    					<div class="col-10">
    						<h4>Live Geo Location</h4>
    						<h6 style="font-weight: 400;"><strong>Status</strong> - <span style="color: green;">ONLINE</span></h6>
    					</div>
    				</div>
    			   
    			</div>
    			<div class="col-4 text-right">
    			
    			</div>
    			<div class="col-5 text-right">
    				<h6><strong>Current Location</strong> Lat <span class="badge badge-secondary" id="current_span_lat">NA</span> Lng <span class="badge badge-secondary" id="current_span_lng">NA</span></h6>
    				<h6><strong>New Location</strong> Lat <span class="badge badge-success" id="new_span_lat">NA</span> Lng <span class="badge badge-success" id="new_span_lng">NA</span></h6>
    			</div>
    		</div>
        
    		<div id="map" style="height: 400px;">Loading...</div>
    		<p>Refreshing every 4 seconds</p>
    </div>
	
    
   <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAm0oE4Pjs2MAeT4i_hvaMYV9dynLTD8lI"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marker-animate-unobtrusive/0.2.8/vendor/markerAnimate.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/marker-animate-unobtrusive/0.2.8/SlidingMarker.min.js"></script>
	<script>
	  SlidingMarker.initializeGlobally();
	</script>
    <script>
    	  var map = undefined;
      var marker = undefined;
      var currentLat;
      var currentLng;
      var pathCoordinates = [];
      var pathLine = undefined;
      var marker = undefined;
      var markers = [];

      
	function LoadLocation(){
  	    $("#current_span_lat").text(currentLat)
  	    $("#current_span_lng").text(currentLng)
      $(function() {
          $.getJSON("/location/"+currentLat+"/"+currentLng,function(json){
          	    $("#new_span_lat").text(json.latitude)
        	        $("#new_span_lng").text(json.longitude)
        	        pathCoordinates.push({lat: currentLat, lng: currentLng});
          	    currentLat = json.latitude;
          	    currentLng = json.longitude;
          	    pathCoordinates.push({lat: json.latitude, lng: json.longitude});
          	    //console.log(pathCoordinates);
          	    //pathLine.setMap(map);
          	    
          	    
          	    setMapOnAll(null);// Deletes all markers in the array by removing references to them.
          	    markers = [];
          	    makeMarkerObj(json.latitude, json.longitude);
                //map.setCenter(new google.maps.LatLng(parseFloat(json.latitude), parseFloat(json.longitude)));
          });
      });
  	  console.log("\n");  
     }
	  
	function geocodeLatLng(geocoder, map, infowindow) {
        var latlngStr = "40.714224,-73.961452".split(',', 2);
        var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              map.setZoom(11);
              var marker = new google.maps.Marker({
                position: latlng,
                map: map
              });
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
	}
        
	  function makeMarkerObj(lat, lng){
		  console.log("Setting Marker Object: lat= "+lat+" lng="+lng);
		  marker = new SlidingMarker({
  		    position: {lat: parseFloat(lat), lng: parseFloat(lng)},
  		    title:	"Harit",
  		    	icon:'/marker.png',
  		    	duration: 4000,
  		    easing: "easeOutExpo"
  		  }); 
		  markers.push(marker);
		  setMapOnAll(map);
	  }
	  
	  
	  function setMapOnAll(map) {
	        for (var i = 0; i < markers.length; i++) {
	          markers[i].setMap(map);
	        }
	      }

	  
      function initMap() {
			    	  navigator.geolocation.getCurrentPosition(function(location) {
			    		  currentLat = location.coords.latitude;
			    		  currentLng = location.coords.longitude;
			    		  console.log("Initial Location: "+ location.coords.latitude+" : "+location.coords.longitude);
			    		  map = new google.maps.Map(document.getElementById('map'), {
				              center: {lat: currentLat, lng: currentLng},
				              zoom: 16,
				              mapTypeId: google.maps.MapTypeId.ROADMAP
				            });
			    		  pathLine = new google.maps.Polyline({
				              path: pathCoordinates,
				              geodesic: true,
				              strokeColor: '#FF0000',
				              strokeOpacity: 1.0,
				              strokeWeight: 2
				            });	 
			    		  
				    	makeMarkerObj(currentLat, currentLng);
				    var geocoder = new google.maps.Geocoder;
			        var infowindow = new google.maps.InfoWindow;
			        //geocodeLatLng(geocoder, map, infowindow);
			    	  });
			    	 
		        
		        
	            setInterval( LoadLocation, 4000 );
      }
      
      $(document).ready(function(){
    	  	initMap();
      });
    </script>
    
   
  </body>
</html>