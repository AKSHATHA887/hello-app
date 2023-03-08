import { BigQuery } from '@google-cloud/bigquery';
import { OdataRequestQuery } from './OdataRequestQuery';
import { DataSourceUtil } from './DataSourceUtil';
import { createFilter, SqlOptions, SQLLang } from 'odata-v4-sql';
import { assert } from 'console';
import { AssertionError } from 'assert';


interface BigQueryProperties {
  project_id: string;
  dataset_id: string;
  path_to_keyfile?: string;
}

interface BigQueryFieldDescriptor {
  name: string,
  type: string,
  mode: string,
  fields?: Array<BigQueryFieldDescriptor>,
}

export class BigQueryDataSource implements DataSource {
  project_id: string;
  dataset_id: string;
  path_to_keyfile?: string;
  bigquery: BigQuery;
  config: object;
  util: DataSourceUtil;
  sqlOptions: SqlOptions = {
    useParameters: false,
    type: SQLLang.PostgreSql,
  };

  constructor(properties: BigQueryProperties, config: object, bigquery?: BigQuery) {
    this.project_id = properties.project_id;
    this.dataset_id = properties.dataset_id;
    this.path_to_keyfile =
      properties.path_to_keyfile == null ? '' : properties.path_to_keyfile;
    this.config = config; // TODO: do config validation (asserts)
    this.util = new DataSourceUtil(config);
    this.initializeBQClient(bigquery);
    this.validateConfig();
  }

  initializeBQClient(bigquery?: BigQuery) {
    let bigqueryOptions = {};
    if (this.path_to_keyfile == null) {
      bigqueryOptions = {
        projectId: this.project_id,
      };
    } else {
      bigqueryOptions = {
        keyFilename: this.path_to_keyfile,
        projectId: this.project_id,
      };
    }

    if(bigquery != null) {
      this.bigquery = bigquery
    } else {
      this.bigquery = new BigQuery(bigqueryOptions);
    }
  }

  assert(condition: any, msg?: string): asserts condition {
    if (condition == false) throw new Error(msg)
  }


  validateConfig() {
   
    console.log(`parsedConfig - ${this.getConfig()}`);

    console.log(`parsedConfig - ${this.getConfig().project.air_id}`);

    this.assert(this.getConfig().project.air_id != null || this.getConfig().project.air_id != undefined,  "Project air_id can not be null");
    
    this.assert(typeof this.getConfig().project.air_id == "number" || typeof this.getConfig().project.air_id == "string","Project air_id should be number or string");

    this.assert(this.getConfig().project.name != null || this.getConfig().project.name != undefined,"Project name can not be null");

    this.assert(this.getConfig().api.base_url != null || this.getConfig().api.base_url != undefined,"API Base URL can not be null");

    this.assert(this.getConfig().datasource.type != null || this.getConfig().datasource.type != undefined,"Datasource Type can not null"); 

    

    this.assert(this.getConfig().datasource.properties.project_id != null || this.getConfig().datasource.properties.project_id != undefined,"Project Id can not null");
    this.assert(this.getConfig().datasource.properties.dataset_id != null || this.getConfig().datasource.properties.dataset_id != undefined,"Dataset Id can not null");
    this.assert(this.getConfig().datasource.properties.path_to_keyfile != null || this.getConfig().datasource.properties.path_to_keyfile != undefined,"Service account key file can not null");
    this.assert(this.getConfig().datasource.schema.tables != null || this.getConfig().datasource.schema.tables != undefined,"At least table should be define");
    this.assert(this.getConfig().datasource.schema.tables.length != 0,"At least one table should be define");
  }

  /**
   * Queries the database based on ODATA request and returns the results
   * @param table table to be queried
   * @param requestQuery ODATA query parameters
   * @returns Results of the query
   */
  async query(table: string, requestQuery: OdataRequestQuery): Promise<object> {
    const query: string = this.toBigQuerySQL(table, requestQuery).replace(/\s\s+/g, ' ');
    const results = await this.getResults(query);
    if (this.isRequestForCount(requestQuery)) {
      return { count: results[0].f0_ };
    }
    return results;
  }

  isRequestForCount(requestQuery: OdataRequestQuery): boolean {
    return (
      requestQuery.$count != null && requestQuery.$count.trim().toLowerCase() == 'true'
    );
  }

  async getResults(query: string) {
    const options = {
      query: query,
      location: 'US',
    };
    const [job] = await this.bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    return rows;
  }

  /**
   * Convert the ODATA request into BigQuery SQL based on the table name and query parameters
   * @param table the table name from the uri
   * @param requestQuery ODATA query parameters
   * @returns BigQuery SQL equivalent as a string
   */
  toBigQuerySQL(table: string, requestQuery: OdataRequestQuery): string {
    let filter = { where: '1 = 1', select: '*' };
    if (requestQuery.$filter) {
      filter = createFilter(requestQuery.$filter.trim(), this.sqlOptions);
    }

    if (this.isRequestForCount(requestQuery)) {
      filter.select = 'count(*)';
    }

    let query = `SELECT ${filter.select} 
                        FROM \`${this.project_id}.${this.dataset_id}.${table}\` 
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
    const result = input.replaceAll(searchText, replaceWith);
    return result.toString();
  }

  getWhere(filter) {
    const replacedString = this.replaceAllstring(filter.where.toString(), '[', '');
    return this.replaceAllstring(replacedString, ']', '');
  }

  getOrderBy(orderby) {
    const tokens = orderby.split(' ');
    if (tokens.length == 0) return '';

    if (tokens.length == 1) return ` ORDER BY ${tokens[0]}`;

    if (tokens.length == 2) {
      this.checkOrderByToken(tokens[1]);
      return ` ORDER BY ${tokens[0]} ${tokens[1].toUpperCase()}`;
    }
    return '';
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
    const table = this.util.getTableNameFromGetEntityByID(tableNameWithEntityID);
    const id = this.util.getIDFromEntityByID(tableNameWithEntityID);
    const params: OdataRequestQuery = { $top: 1 };
    const parsedconfig = this.getConfig();

    const schema = parsedconfig.datasource.schema;

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

    return this.getResults(this.toBigQuerySQL(table, params));
  }

  /**
   * Get metadata of BigQuery dataset in ODATA format
   * @returns Metadata from BigQuery dataset
   */
  async metadata(path: string): Promise<object> {
    const pathArray = path.split('#');
    if (pathArray.length == 1) {
      return this.metadataRoot();
    }
    return {};
  }

  async metadataRoot(): Promise<object> {
    const parsedConfig = this.getConfig();
    const nameSpace = `autoapi.${parsedConfig.datasource.type}:${parsedConfig.datasource.properties.project_id}.${parsedConfig.datasource.properties.dataset_id}`;
    const metadata = { $version: '4.01', $EntityContainer: nameSpace };
    metadata['$Reference'] = this.util.generateReferenceObject(nameSpace);
    metadata[`${parsedConfig.project.air_id}-${parsedConfig.project.name}-API`] =
      await this.generateSchema();
    return metadata;
  }

  async generateSchema(): Promise<object> {
    const schema = { $Alias: 'api' };
    const [tables] = await this.bigquery.dataset(this.dataset_id).getTables();
    const parsedConfig = this.getConfig();
    for (const i in tables) {
      const tableName = tables[i].metadata.tableReference.tableId;
      schema[`${parsedConfig.api.base_url}/${tableName}`] =
        await this.generateTableSchema(tableName);
    }
    return schema;
  }

  async generateTableSchema(tableName: string): Promise<object> {
    const schema = { $Kind: 'EntityType' };
    const parsedConfig = this.getConfig();
    if (this.has(parsedConfig.datasource.schema.tables, tableName)) {
      schema['$Key'] = [parsedConfig.datasource.schema.tables[tableName].primary_key];
    }
    const [tableMetadata] = await this.bigquery
      .dataset(this.dataset_id)
      .table(tableName)
      .getMetadata();
    for (const i in tableMetadata.schema.fields) {
      schema[tableMetadata.schema.fields[i].name] = await this.generateFieldSchema(
        tableMetadata.schema.fields[i]
      );
    }
    return schema;
  }

  async generateFieldSchema(bqField: BigQueryFieldDescriptor): Promise<object> {
    if (bqField.type == 'RECORD' || bqField.type == 'STRUCT') {
      const recordSchema = {
        $Kind: 'ComplexType',
        $Nullable: this.isNullable(bqField.mode),
      };
      if (bqField.mode == 'REPEATED') recordSchema['$Collection'] = true;
      for (const i in bqField.fields) {
        recordSchema[bqField.fields[i].name] = await this.generateFieldSchema(
          bqField.fields[i]
        );
      }
      return recordSchema;
    }
    const fieldSchema = {
      $Nullable: this.isNullable(bqField.mode),
      $Type: this.toEdmType(bqField.type),
    };
    if (bqField.mode == 'REPEATED') fieldSchema['$Collection'] = true;
    return fieldSchema;
  }

  isNullable(mode: string): boolean {
    if (mode == 'NULLABLE') {
      return true;
    }
    return false;
  }

  toEdmType(bqType: string): string {
    switch (bqType) {
      case 'STRING': {
        return 'Edm.String';
        
      }
      case 'BYTES': {
        return 'Edm.Binary';
        
      }
      case 'INTEGER': {
        return 'Edm.Int32';
        
      }
      case 'FLOAT': {
        return 'Edm.Double';
        
      }
      case 'BOOLEAN': {
        return 'Edm.Boolean';
        
      }
      case 'BOOL': {
        return 'Edm.Boolean';
        
      }
      case 'TIMESTAMP': {
        return 'Edm.DateTime';
        
      }
      case 'DATE': {
        return 'Edm.Date';
        
      }
      case 'TIME': {
        return 'Edm.Time';
        
      }
      default: {
        return this._toEDMType(bqType);
      }
    }
  }

  _toEDMType(bqType: string): string {
    switch (bqType) {
      case 'DATETIME': {
        return 'Edm.DateTime';
        
      }
      case 'GEOGRAPHY': {
        return 'Edm.GeographyPoint';
        
      }
      case 'NUMERIC': {
        return 'Edm.Decimal';
        
      }
      case 'DECIMAL': {
        return 'Edm.Decimal';
        
      }
      case 'BIGNUMERIC': {
        return 'Edm.Double';
        
      }
      case 'RECORD': {
        return 'ComplexType';
        
      }
      case 'STRUCT': {
        return 'ComplexType';
        
      }
      default: {
        return bqType;
        
      }
    }
  }

  has(obj: object, key: string): boolean {
    try {
      if (obj[key]) return true;
    } catch (e) {
      return false;
    }
  }

  getConfig(): any {
    return this.config;
  }
}

