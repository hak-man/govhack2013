Distance Cost APIs
===========

Info on transportation time cost calculation.
Modes of transport: Public Transport (Bus, Train, Tram, Ferry), Car, Bike, Pedestrian.

Bus, Trains, Tram, Ferry etc time to commute can be calculated using Adelaide Metro API https://www.adelaidemetro.com.au/jp/plan.

Car, Bike, Pedestrian can be calculated based on shortest/fastest route using OpenStreetMap http://wiki.openstreetmap.org/wiki/OpenRouteService

Ideally we need to create a single service that supports all the transport modes in a single service, normalising all the data sources to do this is probably beyond the time available during GovHack.
