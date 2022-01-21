package org.bs.bookshare.utils;

public class DistanceCounter {
    String DISTANCE_FORMULA = "(6371 * acos(cos(radians(:lat)) * cos(radians(bs.locationLat)) * cos(radians(bs.locationLong) - radians(:lon)) + sin(radians(:lat)) * sin(radians(bs.locationLat))))";

    public static Double calculateDistance(Double lat1, Double long1, Double lat2, Double long2) {
        if (lat1 == null || lat2 == null || long1 == null || long2 == null) {
            return null;
        }
        return 6371 *
                Math.acos(Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.cos(Math.toRadians(long2) - Math.toRadians(long1))
                        + Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)));

    }

    public static Double calculateDistance(Float lat1, Float long1, Float lat2, Float long2) {
        if (lat1 == null || lat2 == null || long1 == null || long2 == null) {
            return null;
        }
        return calculateDistance(lat1.doubleValue(), long1.doubleValue(), lat2.doubleValue(), long2.doubleValue());
    }
}
