package service

import (
	"log"
	"net/http"
	"strings"

	"lnxctl/util"
)

func AddService(response http.ResponseWriter, request *http.Request) {
	var err error

	var name string
	var start_cmd string
	var stop_cmd string
	var restart_cmd string
	var reload_cmd string
	var status_cmd string
	var term_cmd string
	var remark string

	name = strings.TrimSpace(request.FormValue("name"))
	start_cmd = strings.TrimSpace(request.FormValue("start_cmd"))
	stop_cmd = strings.TrimSpace(request.FormValue("stop_cmd"))
	restart_cmd = strings.TrimSpace(request.FormValue("restart_cmd"))
	reload_cmd = strings.TrimSpace(request.FormValue("reload_cmd"))
	status_cmd = strings.TrimSpace(request.FormValue("status_cmd"))
	term_cmd = strings.TrimSpace(request.FormValue("term_cmd"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(name) {
		util.Api(response, 400)
		return
	}

	var create_time string
	var update_time string

	create_time = util.TimeNow()
	update_time = create_time

	{
		var query string
		query = `
			INSERT INTO linux_service (
				name,
				start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
				term_cmd,
				remark, create_time, update_time
			)
			VALUES (?,?,?,?,?,?,?,?,?,?)
		`
		_, err = util.DB.Exec(
			query,
			name,
			start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
			term_cmd,
			remark, create_time, update_time,
		)
		if err != nil {
			log.Println(err)
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				util.Api(response, 409)
				return
			}
			if strings.Contains(err.Error(), "Error 1062 (23000): Duplicate entry") {
				util.Api(response, 409)
				return
			}
		}
		util.Raise(err)
	}

	util.Api(response, 200)
}
