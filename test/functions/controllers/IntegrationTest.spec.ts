import { BigQuery } from '@google-cloud/bigquery';
import test_config from './Config/UnitTest_config.json';


const bigqueryOptions = {
    keyFilename: test_config.datasource.properties.path_to_keyfile,
    projectId: test_config.datasource.properties.project_id,
};

const bigquery = new BigQuery(bigqueryOptions);


describe('BigDataSource Integration Test', () => {
    test('Dataset Creation - Integration Test', async () => {

        const options = {
            location: 'US',
        };

        // Create a new dataset
        const [dataset] = await bigquery.createDataset(test_config.datasource.properties.create_dataset_id, options);
        console.log('Dataset ' + dataset.id + ' created.');
    })
});