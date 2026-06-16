package task

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxctl/util"
)

func GetTask(response http.ResponseWriter, request *http.Request) {
	var err error

	var id string
	id = strings.TrimSpace(request.FormValue("id"))

	if util.IsNotSet(id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(id) {
		util.Api(response, 400)
		return
	}

	var task map[string]any
	task = make(map[string]any)

	{
		var query string
		query = `
			SELECT
				id, name, command,
				remark, create_time, update_time
			FROM linux_task
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id sql.NullInt64
		var name sql.NullString
		var command sql.NullString
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(
			&id, &name, &command,
			&remark, &create_time, &update_time,
		)
		util.Raise(err)

		task = map[string]any{
			"id":          id.Int64,
			"name":        name.String,
			"command":     command.String,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, task)
}
