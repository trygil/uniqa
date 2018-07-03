'use strict'

const Database = use('Database')

class TagController {
    async tagList({ request, response}) {
        let res = [];
        let total = 0;
        let params = request.all();

        try {
            let sql = `
                SELECT INITCAP(t.tag) AS tag, COUNT(p.id) AS post_amount
                FROM tags t
                JOIN posts p ON p.data->'tags' @> ('["'|| t.tag ||'"]')::jsonb
                WHERE (t.tag ILIKE ? OR 1=?)
                GROUP BY INITCAP(t.tag)
                ORDER BY post_amount DESC `;

            total = await Database.table(Database.raw("("+ sql + ") AS t", ['', 1])).getCount();

            let search = !!params.search ? "%" + params.search + "%" : "";

            if (params.search != undefined)
                res = await Database.raw(sql + "LIMIT ?", [search, 0, 5]);
            else
                res = await Database.raw(sql + "LIMIT ?", ['', 1, 20]);
        } catch(e) {
            console.error(e);
            return response.status(500);
        }

        return response.status(200).send({tags: res.rows, total: total});
    }
}

module.exports = TagController
