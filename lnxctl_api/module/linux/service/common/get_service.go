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
			SELECT id, name, term_cmd
			FROM linux_service
			WHERE id=?
		`

		var row *sql.Row
		row = util.DB.QueryRow(query, id)

		var id sql.NullInt64
		var name sql.NullString
		var term_cmd sql.NullString

		err = row.Scan(&id, &name, &term_cmd)
		if err != nil {
			return nil, err
		}

		service = map[string]interface{}{
			"id":       id.Int64,
			"name":     name.String,
			"term_cmd": term_cmd.String,
		}
	}

	return service, nil
}
