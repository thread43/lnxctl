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
	var start_cmd string
	var stop_cmd string
	var restart_cmd string
	var reload_cmd string
	var status_cmd string
	var term_cmd string
	var remark string

	id = strings.TrimSpace(request.FormValue("id"))
	name = strings.TrimSpace(request.FormValue("name"))
	start_cmd = strings.TrimSpace(request.FormValue("start_cmd"))
	stop_cmd = strings.TrimSpace(request.FormValue("stop_cmd"))
	restart_cmd = strings.TrimSpace(request.FormValue("restart_cmd"))
	reload_cmd = strings.TrimSpace(request.FormValue("reload_cmd"))
	status_cmd = strings.TrimSpace(request.FormValue("status_cmd"))
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
			SET
				name=?,
				start_cmd=?, stop_cmd=?, restart_cmd=?, reload_cmd=?, status_cmd=?,
				term_cmd=?,
				remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			name,
			start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
			term_cmd,
			remark, update_time,
			id,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
