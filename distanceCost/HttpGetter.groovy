#!/usr/bin/env groovy

//---
// This code is released under the GPL v3 license (see: http://www.gnu.org/licenses/gpl-3.0.txt)
//---

import groovyx.net.http.*
@Grab(group='org.codehaus.groovy.modules.http-builder',
module='http-builder', version='0.5.2' )


def base = "http://data.sa.gov.au/api/3/action/"
def http = new HTTPBuilder(base)

http.get(path: 'tag_list',
		 /*query: [id: tag]*/) { response, xml ->
	if (response.status == 200) {
		println xml
	} else {
		System.err.println("Request failed. HTTP: ${response.status}")
	}
}
