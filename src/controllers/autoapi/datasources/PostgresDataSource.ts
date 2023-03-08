import { OdataRequestQuery } from "./OdataRequestQuery";
import { DataSourceUtil } from './DataSourceUtil';
import Knex from 'knex';
//import { resolve } from "path";
var createFilter = require('odata-v4-sql').createFilter;
const sqlOptions = {
    useParameters: false,
    type: "PostgreSql"
};


interface PostgresProperties {
    username: string;
    password: string;
    dbname: string;
    dbhost: string;
    dbport?: number;
}

const config = {
    pool: {
        max: 5,
        min: 5,
        acquireTimeoutMillis: 60000,
    },
    createTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
    createRetryIntervalMillis: 200,
};

export class PostgresDataSource implements DataSource {
    knex: any;
    util: DataSourceUtil;
    config: object;

    constructor(properties: PostgresProperties, config: object) {
        this.util = new DataSourceUtil(config);
        this.config = config;
        if (process.env.ENVIRONMENT == "local" || process.env.ENVIRONMENT == "test") {
            this.knex = Knex({
                client: 'pg',
                connection: {
                    user: properties.username,
                    password: properties.password,
                    database: properties.dbname,
                    host: properties.dbhost,
                    port: properties.dbport
                },
                ...config,
            });
        }
    }

    /**
     * Queries the database based on ODATA request and returns the results
     * @param table table to be queried
     * @param requestQuery ODATA query parameters
     * @returns Results of the query 
     */
    async query(table: string, requestQuery: OdataRequestQuery): Promise<object> {
        let query: string = this.toPostgresSQL(table, requestQuery).replace(/\s\s+/g, ' ');
        let results = await this.getResults(query);
        return results;
    }

    async getResults(query: string) {
        let results = await this.knex.raw(query);
        return results.rows;
    }

    toPostgresSQL(table: string, requestQuery: OdataRequestQuery): string {
        var filter = { where: "1 = 1", select: "*" };
        if (requestQuery.$filter) {
            filter = createFilter(requestQuery.$filter.trim(), sqlOptions);
        }

        if (this.isRequestForCount(requestQuery)) {
            filter.select = "count(*)";
        }

        var query = `SELECT ${filter.select} 
                        FROM ${table} 
                        WHERE ${this.getWhere(filter)}`;

        if (requestQuery.$orderby) {
            query += this.getOrderBy(requestQuery.$orderby.trim());
        }

        if (requestQuery.$top) {
            query += ` LIMIT ${requestQuery.$top}`;
        }
        return query;
    }

    replaceAllstring(input: string, searchText, replaceWith) {
        var result = input.replaceAll(searchText, replaceWith);
        return result.toString();
    }

    getWhere(filter) {
        var replacedString = this.replaceAllstring(filter.where.toString(), '[', '');
        return this.replaceAllstring(replacedString, ']', '');
    }

    getOrderBy(orderby) {
        var tokens = orderby.split(' ');
        if (tokens.length == 0) return '';

        if (tokens.length == 1) return ` ORDER BY ${tokens[0]}`

        if (tokens.length == 2) {
            this.checkOrderByToken(tokens[1]);
            return ` ORDER BY ${tokens[0]} ${tokens[1].toUpperCase()}`;
        }
        return '';
    }

    isRequestForCount(requestQuery: OdataRequestQuery): boolean {
        return requestQuery.$count != null && requestQuery.$count.trim().toLowerCase() == 'true'
    }

    orderByError = 'Malformed $orderby. Correct usage: $orderby:field [asc|desc]';
    checkOrderByToken(ascOrDesc: string) {
        if (ascOrDesc.toLowerCase() == 'asc' || ascOrDesc.toLowerCase() == 'desc') {
            return;
        }
        throw new Error(this.orderByError);
    }

    entityByIDError = `Primary key not set up for the table you are requesting.`;
    /**
     * Returns an entity from a table by unique key, error if none set up for table
     * @param tableNameWithEntityID in the form of table_name('entity_id') or table_name("entity_id") 
     * @returns Entity with the given ID
     */
    async getEntityByID(tableNameWithEntityID: string) {
        var table = this.util.getTableNameFromGetEntityByID(tableNameWithEntityID);
        var id = this.util.getIDFromEntityByID(tableNameWithEntityID);
        var params: OdataRequestQuery = { "$top": 1 };
        var parsedconfig = this.getConfig();

        var schema = parsedconfig.datasource.schema;

        try {
            if (schema.tables[table].primary_key) {
                params.$filter = `${schema.tables[table].primary_key} eq ${id}`;
            }
        } catch (e) {
            throw new Error(this.entityByIDError);
        }

        if (schema.tables[table].default_orderby) {
            params.$orderby = schema.tables[table].default_orderby;
        }

        return this.getResults(this.toPostgresSQL(table, params));
    }

    /**
     * Get metadata of BigQuery dataset in ODATA format
     * @returns Metadata from BigQuery dataset
     */
    async metadata(path: string): Promise<object> {
        var pathArray = path.split('#');
        if (pathArray.length == 1) {
            return this.metadataRoot();
        }
        return {};
    }

    async metadataRoot() {
        var parsedConfig = this.getConfig();
        var nameSpace = `autoapi.${parsedConfig.datasource.type}:${parsedConfig.datasource.properties.dbhost}.${parsedConfig.datasource.properties.dbname}`;
        var metadata = { "$version": "4.01", "$EntityContainer": nameSpace };
        metadata["$Reference"] = this.util.generateReferenceObject(nameSpace);
        //metadata[`${parsedConfig.project.air_id}-${parsedConfig.project.name}-API`] = await this.generateSchema();
        return metadata;
    }

    getConfig (): any{
        return JSON.parse(JSON.stringify(this.config));
    }

}