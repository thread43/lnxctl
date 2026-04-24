package target

import (
	"database/sql"
	"net/http"

	"lnxctl/util"
)

func GetTargets(response http.ResponseWriter, request *http.Request) {
	var err error

	var targets []map[string]interface{}
	targets = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT
			id,
			name, crontab, type,
			ping_host,
			tcp_host, tcp_port,
			http_url,
			check_status, check_result, check_time,
			is_active, remark, create_time, update_time
			FROM monitoring_target
			ORDER BY name
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var name sql.NullString
			var crontab sql.NullString
			var type2 sql.NullInt64
			var ping_host sql.NullString
			var tcp_host sql.NullString
			var tcp_port sql.NullString
			var http_url sql.NullString
			var check_status sql.NullInt64
			var check_result sql.NullString
			var check_time sql.NullString
			var is_active sql.NullInt64
			var remark sql.NullString
			var create_time sql.NullString
			var update_time sql.NullString

			err = rows.Scan(
				&id,
				&name, &crontab, &type2,
				&ping_host,
				&tcp_host, &tcp_port,
				&http_url,
				&check_status, &check_result, &check_time,
				&is_active, &remark, &create_time, &update_time,
			)
			util.Raise(err)

			targets = append(
				targets,
				map[string]interface{}{
					"id":           id.Int64,
					"name":         name.String,
					"crontab":      crontab.String,
					"type":         type2.Int64,
					"ping_host":    ping_host.String,
					"tcp_host":     tcp_host.String,
					"tcp_port":     tcp_port.String,
					"http_url":     http_url.String,
					"check_status": check_status.Int64,
					"check_result": check_result.String,
					"check_time":   util.TimeOf(check_time.String),
					"is_active":    is_active.Int64,
					"remark":       remark.String,
					"create_time":  util.TimeOf(create_time.String),
					"update_time":  util.TimeOf(update_time.String),
				},
			)
		}
	}

	util.Api(response, 200, targets)
}
