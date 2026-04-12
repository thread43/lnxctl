package service

import (
	"net/http"
	"strings"

	"lnxctl/util"
)

func UpdateService(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var name string
	var term_cmd string
	var remark string

	id = strings.TrimSpace(request.FormValue("id"))
	name = strings.TrimSpace(request.FormValue("name"))
	term_cmd = strings.TrimSpace(request.FormValue("term_cmd"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(id, name) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var update_time string
	update_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE linux_service
			SET name=?, term_cmd=?, remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			name, term_cmd, remark, update_time,
			id,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
