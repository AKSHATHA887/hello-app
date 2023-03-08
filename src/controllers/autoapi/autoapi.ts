import { Request, Response } from 'express';
//import { env } from 'process';
import { BigQueryDataSource } from './datasources/BigQueryDataSource';
import { DataSourceUtil } from './datasources/DataSourceUtil';
import { OdataRequestQuery } from './datasources/OdataRequestQuery';
import { PostgresDataSource } from './datasources/PostgresDataSource';
const metadata = /^\$metadata/i;


export class AutoAPI {
    datasource: DataSource;
    config: object;
    util: DataSourceUtil;

    constructor(config: object) {
        this.config = config;
        this.util = new DataSourceUtil(config);
        switch (this.getConfig().datasource.type) {
            case "bigquery": {
                if (process.env.ENVIRONMENT == "local" || process.env.ENVIRONMENT == "test") {
                    this.datasource = new BigQueryDataSource({
                        project_id: this.getConfig().datasource.properties.project_id,
                        dataset_id: this.getConfig().datasource.properties.dataset_id,
                        path_to_keyfile: this.getConfig().datasource.properties.path_to_keyfile
                    }, config);
                }
                else {
                    this.datasource = new BigQueryDataSource({
                        project_id: this.getConfig().datasource.properties.project_id,
                        dataset_id: this.getConfig().datasource.properties.dataset_id
                    }, config);
                }
                break;
            }
            case "postgres": {
                if (process.env.ENVIRONMENT == "local" || process.env.ENVIRONMENT == "test") {
                    this.datasource = new PostgresDataSource({
                        username: this.getConfig().datasource.properties.username,
                        password: this.getConfig().datasource.properties.password,
                        dbname: this.getConfig().datasource.properties.dbname,
                        dbhost: this.getConfig().datasource.properties.dbhost
                    }, config);
                }
                else {
                    // TODO
                }
                break;
            }
            default: {
                throw new Error('No datasource.type defined in config file.');
            }
        }
    }

    getConfig(): any {
        return JSON.parse(JSON.stringify(this.config));
    }

    async autoapi(req: Request, res: Response): Promise<void> {
        try {
            var results;
            if (process.env.ENVIRONMENT != "local") {
                req.params.table = req.params["0"].split('/')[1];
            }
            if (metadata.test(req.params.table.trim())) {
                results = await this.datasource.metadata(req.params.table);
                res.send(results);
            } else if (this.isRequestForEntityByID(req.params.table)) {
                results = await this.datasource.getEntityByID(req.params.table);
                res.send(this.addOdataEnvelope(req, results));
            } else {
                results = await this.datasource.query(req.params.table, req.query);
                res.send(this.addOdataEnvelope(req, results));
            }
        } catch (e) {
            res.send(e.stack);
        }
        return;
    }

    addOdataEnvelope(req: Request, results: Array<object>): object {
        var baseUrl = this.getConfig().api.base_url;
        var envelope = { "@odata.context": `${baseUrl}/$metadata#${req.params.table}` };
        if (this.isRequestForEntityByID(req.params.table)) {
            envelope["@odata.context"] = `${baseUrl}/$metadata#${this.util.getTableNameFromGetEntityByID(req.params.table)}`;
            envelope["@odata.id"] = `${baseUrl}/${req.params.table}`;
            if (results.length == 1) {
                return this.promoteFieldsToRoot(envelope, results[0]);
            }
            return envelope;
        } else if (this.isRequestForCount(req.query)) {
            return results;
        }
        else {
            envelope["value"] = this.addOdataEnvelopeForEachRow(req, results);
            return envelope;
        }
    }

    addOdataEnvelopeForEachRow(req: Request, results: Array<object>): Array<object> {
        var schema = this.getConfig().datasource.schema;
        try {
            if (schema.tables[req.params.table].primary_key) {
                var primaryKeyName = schema.tables[req.params.table].primary_key;
                for (var i in results) {
                    results[i]["@odata.id"] = `${this.getConfig().api.base_url}/${req.params.table}('${results[i][primaryKeyName]}')`;
                }
                return results;
            }
        } catch (e) {
            return results;
        }
    }


    promoteFieldsToRoot(root: object, obj: object): object {
        for (var i in obj) {
            root[i] = obj[i];
        }
        return root;
    }

    isRequestForEntityByID(table: string): boolean {
        var regex = /([a-zA-Z0-9_]*)\(["']([a-zA-Z0-9_]*)["']\)/g; // table_name('entity_id') -- only letters, numbers, underscores allowed
        if (regex.test(table.trim())) {
            return true;
        }
        return false;
    }

    isRequestForCount(requestQuery: OdataRequestQuery): boolean {
        if (requestQuery.$count != null && requestQuery.$count.trim().toLowerCase() == "true") {
            return true;
        }
        return false;
    }
}