package common

import (
	"database/sql"

	"lnxctl/util"
)

func GetMenuTree() []map[string]any {
	var err error

	var menus []map[string]any
	menus = make([]map[string]any, 0)

	{
		var query string
		query = "SELECT id, code, name, parent_menu_id FROM auth_menu ORDER BY sort, code"

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		var id sql.NullInt64
		var code sql.NullString
		var name sql.NullString
		var parent_menu_id sql.NullInt64

		for rows.Next() {
			err = rows.Scan(&id, &code, &name, &parent_menu_id)
			util.Raise(err)

			menus = append(
				menus,
				map[string]any{
					"id":             id.Int64,
					"code":           code.String,
					"name":           name.String,
					"parent_menu_id": parent_menu_id.Int64,
				},
			)
		}
	}

	var menus2 map[int64][]map[string]any
	menus2 = make(map[int64][]map[string]any)

	{
		var menu map[string]any
		for _, menu = range menus {
			var parent_menu_id int64
			parent_menu_id, _ = menu["parent_menu_id"].(int64)

			if parent_menu_id != 0 {
				menus2[parent_menu_id] = append(menus2[parent_menu_id], menu)
			}
		}
	}

	var menus3 []map[string]any
	menus3 = make([]map[string]any, 0)

	{
		var menu map[string]any
		for _, menu = range menus {
			var id int64
			var parent_menu_id int64

			id, _ = menu["id"].(int64)
			parent_menu_id, _ = menu["parent_menu_id"].(int64)

			if parent_menu_id == 0 {
				if menus2[id] == nil {
					menus2[id] = make([]map[string]any, 0)
				}
				menu["children"] = menus2[id]
				menus3 = append(menus3, menu)
			}
		}
	}

	return menus3
}
