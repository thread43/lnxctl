package task

import (
	"net/http"
	"strings"

	"lnxctl/util"
)

func AddTask(response http.ResponseWriter, request *http.Request) {
	var err error

	var name string
	var command string
	var remark string

	name = strings.TrimSpace(request.FormValue("name"))
	command = strings.TrimSpace(request.FormValue("command"))
	remark = strings.TrimSpace(request.FormValue("remark"))

	if util.IsNotSet(name, command) {
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
			INSERT INTO linux_task (
				name, command,
				remark, create_time, update_time
			)
			VALUES (?,?,?,?,?)
		`
		_, err = util.DB.Exec(
			query,
			name, command,
			remark, create_time, update_time,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
