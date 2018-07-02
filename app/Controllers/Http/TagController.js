'use strict'

const Database = use('Database')

class TagController {
    async tagList() {
        let res = [];
        let total = 0;

        try {
            let sql = `
                SELECT INITCAP(t.tag) AS tag, COUNT(p.id) AS post_amount
                FROM tags t
                JOIN posts p ON p.data->'tags' @> ('["'|| t.tag ||'"]')::jsonb
                GROUP BY INITCAP(t.tag)
                ORDER BY post_amount DESC `;

            total = await Database.table(Database.raw("("+ sql + ") AS t")).getCount();
            res = await Database.raw(sql + "LIMIT ?", [20]);
        } catch(e) {
            console.error(e);
        }

        return {tags: res.rows, total: total};
    }
}

module.exports = TagController
