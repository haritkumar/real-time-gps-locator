package com.geo;

import java.util.Date;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Api {

	Logger logger = LoggerFactory.getLogger(Api.class);
	@GetMapping("/location/{lat}/{lng}")
	public Location getLocation(@PathVariable double lat, @PathVariable double lng) {
		logger.info("Fetching location : "+new Date());
		return getLocation(lng,lat,500);
	}
	
	public static Location getLocation(double x0, double y0, int radius) {
	    Random random = new Random();

	    // Convert radius from meters to degrees
	    double radiusInDegrees = radius / 111000f;

	    double u = random.nextDouble();
	    double v = random.nextDouble();
	    double w = radiusInDegrees * Math.sqrt(u);
	    double t = 2 * Math.PI * v;
	    double x = w * Math.cos(t);
	    double y = w * Math.sin(t);

	    // Adjust the x-coordinate for the shrinking of the east-west distances
	    double new_x = x / Math.cos(Math.toRadians(y0));

	    double foundLongitude = new_x + x0;
	    double foundLatitude = y + y0;
	    System.out.println("Longitude: " + foundLongitude + "  Latitude: " + foundLatitude );
	    long cv = Math.round( Math.random() );
	    if(cv == 1) {
	    	 return new Location(foundLatitude, foundLongitude,"ONLINE");
	    }else {
	     	return new Location(foundLatitude, foundLongitude,"OFFLINE");
	    }
	   
	}
}
