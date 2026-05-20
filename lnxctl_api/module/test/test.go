package test

import (
	"net/http"

	"lnxctl/util"
)

func Test(response http.ResponseWriter, request *http.Request) {
	var result map[string]any
	result = make(map[string]any)

	result = map[string]any{
		"x": 1,
		"y": 2,
	}

	util.Api(response, 200, result)
}
