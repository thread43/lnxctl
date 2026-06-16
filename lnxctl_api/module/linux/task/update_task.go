package task

import (
	"net/http"
	"strings"

	"lnxctl/util"
)

func UpdateTask(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	var name string
	var command string
	var remark string

	id = strings.TrimSpace(request.FormValue("id"))
	name = strings.TrimSpace(request.FormValue("name"))
	command = strings.TrimSpace(request.FormValue("command"))
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
			UPDATE linux_task
			SET
				name=?, command=?,
				remark=?, update_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			name, command,
			remark, update_time,
			id,
		)
		util.Raise(err)
	}

	util.Api(response, 200)
}
