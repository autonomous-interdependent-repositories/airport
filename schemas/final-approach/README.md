# Final Approach

## Why the name 

"In aeronautics, the final approach (also called the final leg and final approach leg[1]) is the last leg in an aircraft's approach to landing, when the aircraft is lined up with the runway and descending for landing."

@airport/final-approach has the key runtime dependencies for
AIRport Apps.

## Description

Currently contains AirEntity - the super class for all AIRport entities.  It is it's own library to reduce code included in API stubs of AIR Apps.  It is a schema due to AirEntity being a
superclass of actual entities and thus aneed for a descriptor.