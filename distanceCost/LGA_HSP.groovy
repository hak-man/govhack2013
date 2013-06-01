#!/usr/bin/env groovy

//---
// This code is released under the GPL v3 license (see: http://www.gnu.org/licenses/gpl-3.0.txt)
//
// Processes Adelaide LGA positions against SA hospital positions to determine 
// time distance for travel using http://www.yournavigation.org/ YOURS service.
//---

import groovyx.net.http.*
@Grab(group='org.codehaus.groovy.modules.http-builder',
	module='http-builder', version='0.5.2' )
/* YOURS API example
 * http://www.yournavigation.org/api/dev/route.php
 * ?flat=-34.930145515175
 * &flon=138.59992980426
 * &tlat=-34.968979648906
 * &tlon=138.56079101032
 * &v=motorcar
 * &fast=1
 * &layer=mapnik
 * &instructions=1
 */

def base = "http://www.yournavigation.org"
def routeREST = "/api/dev/route.php"
def http = new HTTPBuilder(base)
def hospData = "hosp.sqldata"
def lgaData = "lga_cent_sqldata"
def line, line2

new File(hospData).withReader  { reader ->
	reader.readLine()
	reader.readLine()
	while (line = reader.readLine()) {
		def hData = line.split("\\|")
		new File(lgaData).withReader  { reader2 ->
			reader2.readLine()
			reader2.readLine()
			while (line2 = reader2.readLine()) {
				def lData = line2.split("\\|")
				//println "flat=${hData[2].trim()}&flon=${hData[3].trim()}&tlat=" 
				http.get(path: routeREST,
					query: [
						flat: hData[2].trim(),
						flon: hData[3].trim(),
						tlat: lData[2].trim(),
						tlon: lData[3].trim(),
						v: "motorcar",
						fast: "1",
						layer: "mapnik",
						instructions: "1"
					]) { response, xml ->
					if (response.status == 200) {
						def traveltime = xml.Document.traveltime.toString()
						def distance = xml.Document.distance.toString()
						println ("INSERT INTO h2l_data VALUES ("+hData[0].trim()+","+hData[1].trim()+","+lData[0].trim()+","+lData[1].trim()+","+ distance + ","+ traveltime+");") 
					} else {
						System.err.println("Request failed. HTTP: ${response.status}")
					}
				}
				//Test break
				//System.exit(0);
			}
		}
	}
}