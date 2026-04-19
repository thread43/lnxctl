package target

import (
	"database/sql"
	"net/http"
	"strings"

	"lnxctl/util"
)

func GetTarget(response http.ResponseWriter, request *http.Request) {
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

	var target map[string]interface{}
	target = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id,
				name, crontab, type,
				ping_host,
				tcp_host, tcp_port,
				http_url, http_status_code,
				check_status, check_result, check_time,
				is_active, remark, create_time, update_time
			FROM monitoring_target
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id2 sql.NullInt64
		var name sql.NullString
		var crontab sql.NullString
		var type2 sql.NullInt64
		var ping_host sql.NullString
		var tcp_host sql.NullString
		var tcp_port sql.NullString
		var http_url sql.NullString
		var http_status_code sql.NullString
		var check_status sql.NullInt64
		var check_result sql.NullString
		var check_time sql.NullString
		var is_active sql.NullInt64
		var remark sql.NullString
		var create_time sql.NullString
		var update_time sql.NullString

		err = row.Scan(
			&id2,
			&name, &crontab, &type2,
			&ping_host,
			&tcp_host, &tcp_port,
			&http_url, &http_status_code,
			&check_status, &check_result, &check_time,
			&is_active, &remark, &create_time, &update_time,
		)
		util.Raise(err)

		target = map[string]interface{}{
			"id":               id2.Int64,
			"name":             name.String,
			"crontab":          crontab.String,
			"type":             type2.Int64,
			"ping_host":        ping_host.String,
			"tcp_host":         tcp_host.String,
			"tcp_port":         tcp_port.String,
			"http_url":         http_url.String,
			"http_status_code": http_status_code.String,
			"check_status":     check_status.Int64,
			"check_result":     check_result.String,
			"check_time":       check_time.String,
			"is_active":        is_active.Int64,
			"remark":           remark.String,
			"create_time":      util.TimeOf(create_time.String),
			"update_time":      util.TimeOf(update_time.String),
		}
	}

	util.Api(response, 200, target)
}
