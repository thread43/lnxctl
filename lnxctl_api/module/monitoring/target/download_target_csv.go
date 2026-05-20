package target

import (
	"database/sql"
	"encoding/csv"
	"net/http"
	"strconv"

	"lnxctl/util"
)

func DownloadTargetCsv(response http.ResponseWriter, request *http.Request) {
	var err error

	var targets []map[string]any
	targets = make([]map[string]any, 0)

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
				map[string]any{
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

	var records [][]string
	records = [][]string{
		{
			// "id",
			"name",
			"crontab",
			"type",
			"ping_host",
			"tcp_host",
			"tcp_port",
			"http_url",
			// "check_status",
			// "check_result",
			// "check_time",
			"is_active",
			"remark",
			"create_time",
			"update_time",
		},
	}

	var target map[string]any
	for _, target = range targets {
		records = append(records, []string{
			// strconv.FormatInt(target["id"].(int64), 10),
			target["name"].(string),
			target["crontab"].(string),
			strconv.FormatInt(target["type"].(int64), 10),
			target["ping_host"].(string),
			target["tcp_host"].(string),
			target["tcp_port"].(string),
			target["http_url"].(string),
			// strconv.FormatInt(target["check_status"].(int64), 10),
			// target["check_result"].(string),
			// target["check_time"].(string),
			strconv.FormatInt(target["is_active"].(int64), 10),
			target["remark"].(string),
			target["create_time"].(string),
			target["update_time"].(string),
		})
	}

	response.Header().Set("Content-Disposition", "attachment; filename=monitoring_target.csv")
	response.Header().Set("Content-Type", "text/csv")

	var writer *csv.Writer
	writer = csv.NewWriter(response)
	defer writer.Flush()

	err = writer.WriteAll(records)
	util.Raise(err)
}
