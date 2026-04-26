package common

import (
	"database/sql"

	"lnxctl/util"
)

func GetService(id int64) (map[string]interface{}, error) {
	var err error

	var service map[string]interface{}
	service = make(map[string]interface{})

	{
		var query string
		query = `
			SELECT
				id, name,
				start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd,
				term_cmd
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

		err = row.Scan(
			&id, &name,
			&start_cmd, &stop_cmd, &restart_cmd, &reload_cmd, &status_cmd,
			&term_cmd,
		)
		if err != nil {
			return nil, err
		}

		service = map[string]interface{}{
			"id":          id.Int64,
			"name":        name.String,
			"start_cmd":   start_cmd.String,
			"stop_cmd":    stop_cmd.String,
			"restart_cmd": restart_cmd.String,
			"reload_cmd":  reload_cmd.String,
			"status_cmd":  status_cmd.String,
			"term_cmd":    term_cmd.String,
		}
	}

	return service, nil
}
