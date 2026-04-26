package service

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxctl/util"
)

func GetService(response http.ResponseWriter, request *http.Request) {
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

	var service map[string]interface{}
	service = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, name,
				start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
				term_cmd,
				remark, create_time, update_time
			FROM linux_service
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id sql.NullInt64
		var name sql.NullString
		var start_cmd sql.NullString
		var stop_cmd sql.NullString
		var restart_cmd sql.NullString
		var reload_cmd sql.NullString
		var status_cmd sql.NullString
		var term_cmd sql.NullString
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(
			&id, &name,
			&start_cmd, &stop_cmd, &restart_cmd, &reload_cmd, &status_cmd,
			&term_cmd,
			&remark, &create_time, &update_time,
		)
		util.Raise(err)

		service = map[string]interface{}{
			"id":          id.Int64,
			"name":        name.String,
			"start_cmd":   start_cmd.String,
			"stop_cmd":    stop_cmd.String,
			"restart_cmd": restart_cmd.String,
			"reload_cmd":  reload_cmd.String,
			"status_cmd":  status_cmd.String,
			"term_cmd":    term_cmd.String,
			"remark":      remark.String,
			"create_time": util.TimeOf(create_time.String),
			"update_time": util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, service)
}
