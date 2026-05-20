package dept

import (
	"database/sql"
	"net/http"

	"lnxctl/util"
)

func GetDepts(response http.ResponseWriter, request *http.Request) {
	var err error

	var query string
	query = "SELECT id, name, remark FROM auth_dept ORDER BY name"

	var depts []map[string]any
	depts = make([]map[string]any, 0)

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
			var remark sql.NullString

			err = rows.Scan(&id, &name, &remark)
			util.Raise(err)

			depts = append(
				depts,
				map[string]any{
					"id":     id.Int64,
					"name":   name.String,
					"remark": remark.String,
				},
			)
		}
	}

	util.Api(response, 200, depts)
}
