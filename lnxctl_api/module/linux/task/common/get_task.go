package common

import (
	"database/sql"

	"lnxctl/util"
)

func GetTask(id int64) (map[string]any, error) {
	var err error

	var task map[string]any
	task = make(map[string]any)

	{
		var query string
		query = `
			SELECT id, name, command
			FROM linux_task
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id sql.NullInt64
		var name sql.NullString
		var command sql.NullString

		err = row.Scan(&id, &name, &command)
		if err != nil {
			return nil, err
		}

		task = map[string]any{
			"id":      id.Int64,
			"name":    name.String,
			"command": command.String,
		}
	}

	return task, nil
}
