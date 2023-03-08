import { BigQueryDataSource } from '../../../src/controllers/autoapi/datasources/BigQueryDataSource';
import { QueryRowsResponse } from '@google-cloud/bigquery';
import { json } from 'stream/consumers';

import test_config from './Config/UnitTest_config.json';

const project_id = test_config.datasource.properties.project_id;
const dataset_id = test_config.datasource.properties.dataset_id;
const path_to_keyfile = test_config.datasource.properties.path_to_keyfile;
const BigQuery = require('@google-cloud/bigquery');

const expectedtablesfrombigquery = [
  [
    {
      "_events": {},
      "_eventsCount": 0,
      "metadata": {
        "kind": "bigquery#table",
        "id": "sbx-10054-autoap1-bd-a1e3c636:datalakeopportunity_2.Opportunity",
        "tableReference": {
          "projectId": "sbx-10054-autoap1-bd-a1e3c636",
          "datasetId": "datalakeopportunity_2",
          "tableId": "Opportunity"
        },
        "type": "TABLE",
        "creationTime": "1668011095739"
      }
    }
  ]
];

const expectedSchemafrombigquery = [
  {
    "kind": "bigquery#table",
    "etag": "OtJ0W6lFo7BVyofK4AZQQA==",
    "id": "sbx-10054-autoap1-bd-a1e3c636:datalakeopportunity_2.Opportunity",
    "selfLink": "https://bigquery.googleapis.com/bigquery/v2/projects/sbx-10054-autoap1-bd-a1e3c636/datasets/datalakeopportunity_2/tables/Opportunity",
    "tableReference": {
      "projectId": "sbx-10054-autoap1-bd-a1e3c636",
      "datasetId": "datalakeopportunity_2",
      "tableId": "Opportunity"
    },
    "schema": {
      "fields": [
        {
          "name": "opportunity_id",
          "type": "INTEGER"
        },
        {
          "name": "customer_id",
          "type": "STRING",
          "maxLength": "100"
        },
        {
          "name": "customer_name",
          "type": "STRING",
          "maxLength": "100"
        },
        {
          "name": "opportunity_name",
          "type": "STRING",
          "maxLength": "100"
        },
        {
          "name": "opportunity_description",
          "type": "STRING",
          "maxLength": "500"
        },
        {
          "name": "status_code",
          "type": "STRING",
          "maxLength": "50"
        },
        {
          "name": "win_probability",
          "type": "INTEGER"
        },
        {
          "name": "restricted_flag_indicator",
          "type": "STRING",
          "maxLength": "100"
        },
        {
          "name": "sold_indicator",
          "type": "STRING",
          "maxLength": "100"
        }
      ]
    },
    "numBytes": "2591",
    "numLongTermBytes": "0",
    "numRows": "17",
    "creationTime": "1668011095739",
    "lastModifiedTime": "1668011210422",
    "type": "TABLE",
    "location": "US",
    "numTimeTravelPhysicalBytes": "0",
    "numTotalLogicalBytes": "2591",
    "numActiveLogicalBytes": "2591",
    "numLongTermLogicalBytes": "0",
    "numTotalPhysicalBytes": "3265",
    "numActivePhysicalBytes": "3265",
    "numLongTermPhysicalBytes": "0"
  }
];

const expectedschemaresponse = {
  "$Alias": "api",
  "http://localhost:3000/api/Opportunity": {
    "$Kind": "EntityType",
    "$Key": [
      "opportunity_id"
    ],
    "opportunity_id": {
      "$Nullable": false,
      "$Type": "Edm.Int32"
    },
    "customer_id": {
      "$Nullable": false,
      "$Type": "Edm.String"
    },
    "customer_name": {
      "$Nullable": false,
      "$Type": "Edm.String"
    },
    "opportunity_name": {
      "$Nullable": false,
      "$Type": "Edm.String"
    },
    "opportunity_description": {
      "$Nullable": false,
      "$Type": "Edm.String"
    },
    "status_code": {
      "$Nullable": false,
      "$Type": "Edm.String"
    },
    "win_probability": {
      "$Nullable": false,
      "$Type": "Edm.Int32"
    },
    "restricted_flag_indicator": {
      "$Nullable": false,
      "$Type": "Edm.String"
    },
    "sold_indicator": {
      "$Nullable": false,
      "$Type": "Edm.String"
    }
  }
};

const expectedTableresponse = {
  "$Kind": "EntityType",
  "$Key": [
    "opportunity_id"
  ],
  "opportunity_id": {
    "$Nullable": false,
    "$Type": "Edm.Int32"
  },
  "customer_id": {
    "$Nullable": false,
    "$Type": "Edm.String"
  },
  "customer_name": {
    "$Nullable": false,
    "$Type": "Edm.String"
  },
  "opportunity_name": {
    "$Nullable": false,
    "$Type": "Edm.String"
  },
  "opportunity_description": {
    "$Nullable": false,
    "$Type": "Edm.String"
  },
  "status_code": {
    "$Nullable": false,
    "$Type": "Edm.String"
  },
  "win_probability": {
    "$Nullable": false,
    "$Type": "Edm.Int32"
  },
  "restricted_flag_indicator": {
    "$Nullable": false,
    "$Type": "Edm.String"
  },
  "sold_indicator": {
    "$Nullable": false,
    "$Type": "Edm.String"
  }
};

const expectedmetaresponse = {
  "$version": "4.01",
  "$EntityContainer": "autoapi.bigquery:sbx-10054-autoap1-bd-a1e3c636.datalakeopportunity_2",
  "$Reference": {
    "http://localhost:3000/api": {
      "$Include": [
        {
          "$Namespace": "autoapi.bigquery:sbx-10054-autoap1-bd-a1e3c636.datalakeopportunity_2",
          "$Alias": "api"
        }
      ]
    }
  },
  "1964-MyScheduling-API": {
    "$Alias": "api",
    "http://localhost:3000/api/Opportunity": {
      "$Kind": "EntityType",
      "$Key": [
        "opportunity_id"
      ],
      "opportunity_id": {
        "$Nullable": false,
        "$Type": "Edm.Int32"
      },
      "customer_id": {
        "$Nullable": false,
        "$Type": "Edm.String"
      },
      "customer_name": {
        "$Nullable": false,
        "$Type": "Edm.String"
      },
      "opportunity_name": {
        "$Nullable": false,
        "$Type": "Edm.String"
      },
      "opportunity_description": {
        "$Nullable": false,
        "$Type": "Edm.String"
      },
      "status_code": {
        "$Nullable": false,
        "$Type": "Edm.String"
      },
      "win_probability": {
        "$Nullable": false,
        "$Type": "Edm.Int32"
      },
      "restricted_flag_indicator": {
        "$Nullable": false,
        "$Type": "Edm.String"
      },
      "sold_indicator": {
        "$Nullable": false,
        "$Type": "Edm.String"
      }
    }
  }
}
const expectedrowsresonse = [
  [
    {
      "opportunity_id": 121456789,
      "customer_id": "CS80031",
      "customer_name": "Client Name",
      "opportunity_name": "Opportunity Name",
      "opportunity_description": "Description of the opportunity",
      "status_code": "1",
      "win_probability": 5,
      "restricted_flag_indicator": "Flag Indicator",
      "sold_indicator": "Won"
    }
  ]
]
const expectedtable = 'Opportunity';
const query = 'SELECT * FROM `sbx-10054-autoap1-bd-a1e3c636.datalakeopportunity_2.Opportunity` WHERE opportunity_id = 121456789 ORDER BY opportunity_id DESC LIMIT 1';

const mockMethods = {
  getMetadata: jest.fn().mockImplementation(() => {
    return expectedSchemafrombigquery
  }),
};

const mockdataset = {
  table: jest.fn(() => mockMethods),
  getTables: jest.fn().mockImplementation(() => {
    return expectedtablesfrombigquery
  }),
};

jest.mock('@google-cloud/bigquery', () => {
  return {
    dataset: jest.fn(() => mockdataset),
    createQueryJob: jest.fn().mockImplementation(() => {
      const mockQueryResults = {
        getQueryResults: jest.fn().mockImplementation(() => {
          return [expectedrowsresonse]
        }),
      };
      return [mockQueryResults]
    }),

  }
}
);

const datasource = new BigQueryDataSource(
  {
    project_id: project_id,
    dataset_id: dataset_id,
    path_to_keyfile: path_to_keyfile,
  },
  test_config,
  BigQuery
);

const whitespace = /\s\s+/g;

describe('BigQueryDataSource', () => {

  describe('#getResults', () => {
    it('getResults UT', async () => {
      const result = await datasource.getResults(query);
      expect(JSON.stringify(result)).toBe(JSON.stringify(expectedrowsresonse));
    });
  });

  describe('#metadataRoot', () => {
    it('metadataRoot UT', async () => {
      const result = await datasource.metadataRoot();
      expect(JSON.stringify(result)).toBe(JSON.stringify(expectedmetaresponse));
    });
  });

  describe('#generateSchema', () => {
    it('generateSchema UT', async () => {
      const result = await datasource.generateSchema();
      expect(result['$Alias']).toBe(expectedschemaresponse['$Alias']);
      expect(JSON.stringify(result)).toBe(JSON.stringify(expectedschemaresponse));
    });
  });

  describe('#generateTableSchema', () => {
    it('generateTableSchema UT', async () => {
      const result = await datasource.generateTableSchema(expectedtable);
      expect(JSON.stringify(result)).toBe(JSON.stringify(expectedTableresponse));
    });
  });

  describe('#generateFieldSchema', () => {
    it('generateFieldSchema UT', async () => {

      const InputString = {
        "name": "opportunity_name",
        "type": "STRING",
        "maxLength": "100",
        "mode": ""
      }
      const InputBinary = {
        "name": "opportunity_name",
        "type": "BYTES",
        "mode": "NULLABLE"
      }
      const InputInteger = {
        "name": "win_probability",
        "type": "INTEGER",
        "maxLength": "100",
        "mode": ""
      }
      const InputFloat = {
        "name": "win_probability",
        "type": "FLOAT",
        "mode": ""
      }
      const InputBoolean = {
        "name": "restricted_flag_indicator",
        "type": "BOOLEAN",
        "mode": ""
      }
      const InputBool = {
        "name": "restricted_flag_indicator",
        "type": "BOOL",
        "mode": ""
      }
      const InputTimeStamp = {
        "name": "created_on",
        "type": "TIMESTAMP",
        "mode": ""
      }
      const InputDate = {
        "name": "created_on",
        "type": "DATE",
        "mode": ""
      }
      const InputTime = {
        "name": "created_on",
        "type": "TIME",
        "mode": ""
      }
      const InputDateTime = {
        "name": "created_on",
        "type": "DATETIME",
        "mode": "NULLABLE"
      }
      const InputGeographyPoint = {
        "name": "status_code",
        "type": "GEOGRAPHY",
        "mode": ""
      }
      const InputNumeric = {
        "name": "win_probability",
        "type": "NUMERIC",
        "mode": ""
      }
      const InputDecimal = {
        "name": "win_probability",
        "type": "DECIMAL",
        "mode": ""
      }
      const InputBignumeric = {
        "name": "win_probability",
        "type": "BIGNUMERIC",
        "mode": ""
      }
      const InputRecord = {
        "name": "win_probability",
        "type": "RECORD",
        "mode": "REPEATED",
        "Test": [
          {
            "name": "win_probability",
            "type": "RECORD",
            "mode": ""
          }]
      }
      const InputStruct = {
        "name": "win_probability",
        "type": "STRUCT",
        "mode": ""
      }
      const InputDefault = {
        "name": "win_probability",
        "type": "DEFAULT",
        "mode": ""
      }

      const expectedString = {
        "$Nullable": false,
        "$Type": "Edm.String"
      }
      const expectedBinary = {
        "$Nullable": true,
        "$Type": "Edm.Binary"
      }
      const expectedInteger = {
        "$Nullable": false,
        "$Type": "Edm.Int32"
      }
      const expectedFloat = {
        "$Nullable": false,
        "$Type": "Edm.Double"
      }
      const expectedBoolean = {
        "$Nullable": false,
        "$Type": "Edm.Boolean"
      }
      const expectedBool = {
        "$Nullable": false,
        "$Type": "Edm.Boolean"
      }
      const expectedTimeStamp = {
        "$Nullable": false,
        "$Type": "Edm.DateTime"
      }
      const expectedDate = {
        "$Nullable": false,
        "$Type": "Edm.Date"
      }
      const expectedTime = {
        "$Nullable": false,
        "$Type": "Edm.Time"
      }
      const expectedDateTime = {
        "$Nullable": true,
        "$Type": "Edm.DateTime"
      }
      const expectedGeographyPoint = {
        "$Nullable": false,
        "$Type": "Edm.GeographyPoint"
      }
      const expectedNumeric = {
        "$Nullable": false,
        "$Type": "Edm.Decimal"
      }
      const expectedDecimal = {
        "$Nullable": false,
        "$Type": "Edm.Decimal"
      }
      const expectedBignumeric = {
        "$Nullable": false,
        "$Type": "Edm.Double"
      }
      const expectedRecord = {
        "$Kind": "ComplexType",
        "$Nullable": false,
        "$Collection": true
      }
      const expectedStruct = {
        "$Kind": "ComplexType",
        "$Nullable": false
      }
      const expectedDefault = {
        "$Nullable": false,
        "$Type": "DEFAULT"
      }

      const resultString = await datasource.generateFieldSchema(InputString);
      expect(JSON.stringify(resultString)).toBe(JSON.stringify(expectedString));

      const resultBinary = await datasource.generateFieldSchema(InputBinary);
      expect(JSON.stringify(resultBinary)).toBe(JSON.stringify(expectedBinary));

      const resultInteger = await datasource.generateFieldSchema(InputInteger);
      expect(JSON.stringify(resultInteger)).toBe(JSON.stringify(expectedInteger));

      const resultFloat = await datasource.generateFieldSchema(InputFloat);
      expect(JSON.stringify(resultFloat)).toBe(JSON.stringify(expectedFloat));

      const resultBoolean = await datasource.generateFieldSchema(InputBoolean);
      expect(JSON.stringify(resultBoolean)).toBe(JSON.stringify(expectedBoolean));

      const resultBool = await datasource.generateFieldSchema(InputBool);
      expect(JSON.stringify(resultBool)).toBe(JSON.stringify(expectedBool));

      const resultTimeStamp = await datasource.generateFieldSchema(InputTimeStamp);
      expect(JSON.stringify(resultTimeStamp)).toBe(JSON.stringify(expectedTimeStamp));

      const resultDate = await datasource.generateFieldSchema(InputDate);
      expect(JSON.stringify(resultDate)).toBe(JSON.stringify(expectedDate));

      const resultTime = await datasource.generateFieldSchema(InputTime);
      expect(JSON.stringify(resultTime)).toBe(JSON.stringify(expectedTime));

      const resultDateTime = await datasource.generateFieldSchema(InputDateTime);
      expect(JSON.stringify(resultDateTime)).toBe(JSON.stringify(expectedDateTime));

      const resultGeographyPoint = await datasource.generateFieldSchema(InputGeographyPoint);
      expect(JSON.stringify(resultGeographyPoint)).toBe(JSON.stringify(expectedGeographyPoint));

      const resultNumeric = await datasource.generateFieldSchema(InputNumeric);
      expect(JSON.stringify(resultNumeric)).toBe(JSON.stringify(expectedNumeric));

      const resultDecimal = await datasource.generateFieldSchema(InputDecimal);
      expect(JSON.stringify(resultDecimal)).toBe(JSON.stringify(expectedDecimal));

      const resultBignumeric = await datasource.generateFieldSchema(InputBignumeric);
      expect(JSON.stringify(resultBignumeric)).toBe(JSON.stringify(expectedBignumeric));

      const resultRecord = await datasource.generateFieldSchema(InputRecord);
      expect(JSON.stringify(resultRecord)).toBe(JSON.stringify(expectedRecord));

      const resultStruct = await datasource.generateFieldSchema(InputStruct);
      expect(JSON.stringify(resultStruct)).toBe(JSON.stringify(expectedStruct));

      const resultDefault = await datasource.generateFieldSchema(InputDefault);
      expect(JSON.stringify(resultDefault)).toBe(JSON.stringify(expectedDefault));

    });
  });

  describe('#toBigQuerySQL', () => {
    it('Full table: /api/tablename', async () => {
      const expectedQuery = `SELECT *
                                    FROM \`${project_id}.${dataset_id}.tablename\`
                                    WHERE 1 = 1`.replace(whitespace, ' ');
      expect(datasource.toBigQuerySQL('tablename', {}).replace(whitespace, ' ')).toBe(
        expectedQuery
      );
    });

    it("GET with $filter: /api/tablename?$filter=load_id ge 1 and other eq 3 or contains(CompanyName, 'Alfreds')", async () => {
      const expectedQuery = `SELECT *
                                    FROM \`${project_id}.${dataset_id}.tablename\`
                                    WHERE load_id >= 1 AND other = 3 OR CompanyName like '%Alfreds%'`.replace(
        whitespace,
        ' '
      );
      expect(
        datasource
          .toBigQuerySQL('tablename', {
            $filter: "load_id ge 1 and other eq 3 or contains(CompanyName, 'Alfreds')",
          })
          .replace(whitespace, ' ')
      ).toBe(expectedQuery);
    });

    it('GET with $top: /api/tablename?$top=10', async () => {
      const expectedQuery = `SELECT *
                                    FROM \`${project_id}.${dataset_id}.tablename\`
                                    WHERE 1 = 1 
                                    LIMIT 10`.replace(whitespace, ' ');
      expect(
        datasource.toBigQuerySQL('tablename', { $top: 10 }).replace(whitespace, ' ')
      ).toBe(expectedQuery);
    });

    it('GET with $orderby implicit ASC: /api/tablename?$orderby=field', async () => {
      const expectedQuery = `SELECT *
                                    FROM \`${project_id}.${dataset_id}.tablename\`
                                    WHERE 1 = 1
                                    ORDER BY field`.replace(whitespace, ' ');
      expect(
        datasource
          .toBigQuerySQL('tablename', { $orderby: 'field' })
          .replace(whitespace, ' ')
      ).toBe(expectedQuery);
    });

    it('GET with $orderby ASC: /api/tablename?$orderby=field asc', async () => {
      const expectedQuery = `SELECT *
                                    FROM \`${project_id}.${dataset_id}.tablename\`
                                    WHERE 1 = 1
                                    ORDER BY field ASC`.replace(whitespace, ' ');
      expect(
        datasource
          .toBigQuerySQL('tablename', { $orderby: 'field asc' })
          .replace(whitespace, ' ')
      ).toBe(expectedQuery);
    });

    it('GET with $orderby DESC: /api/tablename?$orderby=field desc', async () => {
      const expectedQuery = `SELECT *
                                    FROM \`${project_id}.${dataset_id}.tablename\`
                                    WHERE 1 = 1
                                    ORDER BY field DESC`.replace(whitespace, ' ');
      expect(
        datasource
          .toBigQuerySQL('tablename', { $orderby: 'field desc' })
          .replace(whitespace, ' ')
      ).toBe(expectedQuery);
    });

    it('GET with $orderby nested field DESC: /api/tablename?$orderby=field.value desc', async () => {
      const expectedQuery = `SELECT *
                                    FROM \`${project_id}.${dataset_id}.tablename\`                                    
                                    WHERE 1 = 1
                                    ORDER BY field.value DESC`.replace(whitespace, ' ');
      expect(
        datasource
          .toBigQuerySQL('tablename', { $orderby: 'field.value desc' })
          .replace(whitespace, ' ')
      ).toBe(expectedQuery);
    });

    it('GET with $orderby malformed: /api/tablename?$orderby=field desc', async () => {
      try {
        datasource.toBigQuerySQL('tablename', { $orderby: 'field asc123' });
      } catch (e) {
        expect(e.message).toBe(datasource.orderByError);
      }
    });

    it('GET with $count: /api/tablename?$count=true', async () => {
      const expectedQuery = `SELECT count(*)
                               FROM \`${project_id}.${dataset_id}.tablename\` 
                               WHERE 1 = 1`.replace(whitespace, ' ');
      expect(datasource.toBigQuerySQL('tablename', { $count: 'true' }).replace(whitespace, ' ')).toBe(expectedQuery);
    });

    it('GET with $count and filter: /api/tablename?$filter=load_id eq 1&$count=true', async () => {
      var expectedQuery = `SELECT count(*) 
                                  FROM \`${project_id}.${dataset_id}.tablename\` 
                                  WHERE load_id = 1`.replace(whitespace, ' ');
      expect(datasource.toBigQuerySQL('tablename', { $count: 'true', $filter: 'load_id eq 1' }).replace(whitespace, ' ')).toBe(expectedQuery);
    });

    it('GET with $count and filter: /api/tablename?$filter=load_id eq 1&$count=false', async () => {
      var expectedQuery = `SELECT * 
                                FROM \`${project_id}.${dataset_id}.tablename\` 
                                WHERE load_id = 1`.replace(whitespace, ' ');
      expect(datasource.toBigQuerySQL('tablename', { $count: 'false', $filter: 'load_id eq 1' }).replace(whitespace, ' ')).toBe(expectedQuery);
    });

    it('GET with $top and filter: /api/tablename?$filter=load_id eq 1&$count=false', async () => {
      var expectedQuery = `SELECT *  
                              FROM \`${project_id}.${dataset_id}.tablename\` 
                              WHERE load_id = 1 LIMIT 1`.replace(whitespace, ' ');
      expect(datasource.toBigQuerySQL('tablename', { $top: 1, $filter: 'load_id eq 1' }).replace(whitespace, ' ')).toBe(expectedQuery);
    });
  });



  describe('#Query', () => {
    it('GET query results', async () => {
      try {
        const results = await datasource.query('Opportunity', {
          $orderby: 'opportunity_id asc',
          $top: 10,
        });
        expect(results).not.toBeNull();
        const parsedResults = JSON.parse(JSON.stringify(results));
        expect(parsedResults).not.toBeNull();
        expect(parsedResults.length).toBeLessThanOrEqual(10);
      } catch (e) {
        expect(e.message).toBe(datasource.orderByError);
      }
    });
  });

  describe('#Querycount', () => {
    it('GET query count with filter', async () => {

      const results = await datasource.query('Opportunity', {
        $top: 10,
      });

      console.log('Querycount results ' + JSON.stringify(results))
      const parsedResults = JSON.parse(JSON.stringify(results));
      console.log('parsedResults  - ' + JSON.stringify(parsedResults))
      //expect(results).not.toBeNull();
      expect(parsedResults.length).toBe(1);

    });
  });

  describe('#getEntityByID', () => {
    it('Table not set up with unique key', async () => {
      try {
        const results = await datasource.getEntityByID("Opportunity('121456789')");
        const parsedResults = JSON.parse(JSON.stringify(results));
        expect(parsedResults).not.toBeNull();
        expect(parsedResults.length).toBe(1);
      } catch (e) {
        expect(e.message).toBe(datasource.entityByIDError);
      }
    });
  });

  describe('#getMetaData', () => {
    it('Get MetaData using OData', async () => {
      try {
        const tableName = `Opportunity`;
        const entityContainer = `autoapi.${test_config.datasource.type}:${test_config.datasource.properties.project_id}.${test_config.datasource.properties.dataset_id}`;
        const results = await datasource.metadata(`${tableName}`);
        const parsedResults = JSON.parse(JSON.stringify(results));
        expect(parsedResults).not.toBeNull();
        expect(parsedResults.$EntityContainer).toBe(entityContainer);
      } catch (e) {
        expect(e.message).toBe(datasource.entityByIDError);
      }
    });
  });

});
