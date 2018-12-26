      var map = undefined;
      var currentLat;
      var currentLng;
      var pathCoordinates = [];
      var marker = undefined;
      var refreshIntervalId;

      function moveMarker(lat,lng) {
		        marker.setPosition(new google.maps.LatLng(parseFloat(lat), parseFloat(lng)));
		        map.panTo(new google.maps.LatLng(parseFloat(lat), parseFloat(lng)));
		};
		
		function drawPath() {
			new google.maps.Polyline({
				path : pathCoordinates,
				geodesic : true,
				strokeColor : '#ff7900',
				strokeOpacity : 1.0,
				strokeWeight : 2,
				map : map
			});
		}	
      
	function LoadLocation(){
      $(function() {
          $.getJSON("/location/"+currentLat+"/"+currentLng,function(json){
        	  	if(currentLat != json.latitude || currentLng != json.longitude){
        	  		$("#status").text(json.status);
        	  		if(json.status == "ONLINE"){
        	  			$("#status").css("color","green");
        	  		}else{
        	  			$("#status").css("color","red");
        	  		}
        	  		$("#current_span_lat").text(currentLat)
        	        $("#current_span_lng").text(currentLng)
          	    $("#new_span_lat").text(json.latitude)
        	        $("#new_span_lng").text(json.longitude)
        	        pathCoordinates.push({lat: currentLat, lng: currentLng});
          	    currentLat = json.latitude;
          	    currentLng = json.longitude;
          	    pathCoordinates.push({lat: json.latitude, lng: json.longitude});
          	    drawPath();
          	    moveMarker(json.latitude,json.longitude);
        	  	}
          });
      });
     }
	  
		
		
      function initMap() {
			    	      navigator.geolocation.getCurrentPosition(function(location) {
			    		  currentLat = location.coords.latitude;
			    		  currentLng = location.coords.longitude;
			    		  $("#current_span_lat").text(currentLat);
			    	      $("#current_span_lng").text(currentLng);
			    		  console.log("Initial Location: "+ location.coords.latitude+" : "+location.coords.longitude);
			    		  map = new google.maps.Map(document.getElementById('map'), {
				              center: {lat: currentLat, lng: currentLng},
				              zoom: 17,
				              mapTypeId: google.maps.MapTypeId.ROADMAP
				      });
			    		  marker = new google.maps.Marker({
			    	  		    position: {lat: parseFloat(currentLat), lng: parseFloat(currentLng)},
			    	  		    title:	"Harit",
			    	  		    	icon:'/marker.png'
			    	  		  });   
			    		  marker['infowindow'] = new google.maps.InfoWindow({
			    	            content: "<strong>HARIT</strong>"
			    	        });
			    		  google.maps.event.addListener(marker, 'mouseover', function() {
			    		        this['infowindow'].open(map, this);
			    		    });
			    		  marker.setMap(map);
			    	  });
			    	  refreshIntervalId = setInterval( LoadLocation, 4000 );
      }
      
      $(document).ready(function(){
    	  	initMap();
    	  	$("#employee_select").on('change', function() {
    	  		map = undefined;
    	  		marker = undefined;
    	  		$("#map").empty();
    	  		$("#map").html('<img src="/loading.gif"/>');
    	  		clearInterval(refreshIntervalId);
    	  		currentLat = "";
    	        currentLng = "";
    	        pathCoordinates = [];
    	        $("#current_span_lat").text("...");
    	        $("#current_span_lng").text("...");
      	    $("#new_span_lat").text("...");
    	        $("#new_span_lng").text("...");
    	        $("#status").text("...");
    	        $("#status").css("color","#000");
    	  		initMap();
    	  	});
      });