package service

import (
	"database/sql"
	"net/http"

	"lnxctl/util"
)

func GetServices(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = `
		SELECT
			id, name,
			start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
			term_cmd,
			remark, create_time, update_time
		FROM linux_service
		ORDER BY name
	`

	var services []map[string]interface{}
	services = make([]map[string]interface{}, 0)

	{
		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
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

			err = rows.Scan(
				&id, &name,
				&start_cmd, &stop_cmd, &restart_cmd, &reload_cmd, &status_cmd,
				&term_cmd,
				&remark, &create_time, &update_time,
			)
			util.Raise(err)

			services = append(
				services,
				map[string]interface{}{
					"id":          id.Int64,
					"name":        name.String,
					"start_cmd":   start_cmd.String,
					"stop_cmd":    stop_cmd.String,
					"restart_cmd": restart_cmd.String,
					"reload_cmd":  reload_cmd.String,
					"status_cmd":  status_cmd.String,
					"term_cmd":    term_cmd.String,
					"remark":      remark.String,
					"create_time": create_time.String,
					"update_time": update_time.String,
				},
			)
		}
	}

	util.Api(response, 200, services)
}
