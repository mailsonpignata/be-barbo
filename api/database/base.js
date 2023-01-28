const { knex } = require('./database')

class Base {
  constructor (table) {
    this.table = table
  }
  
  add (obj) {
    return knex(this.table)
      .insert(obj, 'id')
  }
  
  get (condition, limit, offset, count) {
    let query = `SELECT ${count ? 'count(id)' : '*'} FROM ${this.table}`
    
    if (condition && condition != null && condition !== undefined) {
      query = `${query} WHERE ${condition}`
    }
    if (offset && offset != null && offset !== undefined) {
      query = `${query} OFFSET ${offset}`
    }
    if (limit && limit != null && limit !== undefined) {
      query = `${query} LIMIT ${limit}`
    }
    
    console.log('query ::: ', query)
    
    return knex.raw(query)
  }
  
  async getFirst (condition = '') {
    let result = knex
      .select()
      .from(this.table)
      .limit(1)
    
    if (result && result.length) {
      return result
    }
    return []
  }
  
  getAll () {
    return knex
      .select()
      .from(this.table)
  }
  
  getById (id) {
    return knex
      .select()
      .from(this.table)
      .whereRaw(`id = ${id}`)
  }

  getByPostId (id) {
    return knex
      .select()
      .from(this.table)
      .whereRaw(`blog_id = ${id}`)
  }

  getByEnterpriseId (id) {
    return knex
      .select()
      .from(this.table)
      .whereRaw(`enterprise_id = ${id}`)
  }
  
  getBy (content) {
    return knex
      .select()
      .from(this.table)
      .whereRaw(`${content} = 1`)
  }
  
  getByMatricula (id, nome) {
    return knex
      .select()
      .from(this.table)
      .whereRaw(`matricula = "${id}" AND nome = "${nome}"`)
  }
  
  getCount (where, limit, offset) {
    return this.get(`${where}`, limit, offset, true)
  }
  
  getWhere (where, limit, offset) {
    return knex(this.table)
      .select()
      .whereRaw(where)
  }
  
  getInner (select, inner_table, inner_id, table_id, where) {
    return knex(this.table)
      .select(...select)
      .innerJoin(inner_table, inner_id, table_id)
      .whereRaw(where)
  }
  
  getWhereLimit (where, limit) {
    return knex(this.table)
      .select()
      .limit(limit)
      .whereRaw(where)
  }
  
  getWhereLimitOrderBy (where, limit) {
    return knex(this.table)
        .select()
        .limit(limit)
        .whereRaw(where)
        .orderBy('data','desc')
  }
  
  getOnlyActive (limit, offset) {
    return this.get('ativo = true', limit, offset)
  }
  
  insert (obj) {
    return knex(this.table)
      .insert(obj, 'id')
  }
  
  update ({ id, ...obj }) {
    return knex(this.table)
      .update({ ...obj })
      .where('id', id)
  }

  updateWithoutDate ({ id, ...obj }) {
    return knex(this.table)
      .update({ ...obj })
      .where('id', id)
  }
  
  remove (id) {
    return knex(this.table)
      .delete()
      .where('id', id)
  }
  
  removeBy (field, value) {
    return knex(this.table)
      .delete()
      .where(`${field}`, value)
  }
  
  updateIn ({ id, ...obj }) {
    return knex(this.table)
      .update({ ...obj, update: new Date() })
      .whereIn('id', id)
  }
  
  updateBy (field, value, { ...obj }) {
    return knex(this.table)
      .update({ ...obj, update: new Date() })
      .where(`${field}`, value)
  }
  
  raw (query) {
    return knex
      .raw(query)
  }
}

module.exports = Base
