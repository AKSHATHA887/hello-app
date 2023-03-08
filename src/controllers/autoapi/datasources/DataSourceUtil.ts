
export class DataSourceUtil {
    config: object;

    constructor(config: object){
        this.config = config;
    }

    getIDFromEntityByID(tableNameWithEntityID: string): string {
        var firstQuote = tableNameWithEntityID.search(/(\'|\")/g);
        var firstQuoteOn = tableNameWithEntityID.slice(firstQuote + 1);
        var secondQuote = firstQuoteOn.search(/(\'|\")/g);
        return firstQuoteOn.slice(0, secondQuote);
    }

    getTableNameFromGetEntityByID(tableNameWithEntityID: string){
        var index = tableNameWithEntityID.indexOf('(');
        return tableNameWithEntityID.slice(0, index);
    }

    generateReferenceObject(nameSpace: string){
        var reference = {};
        reference[this.getConfig().api.base_url] = { "$Include": [{ "$Namespace": nameSpace, "$Alias": "api" }] }
        return reference;
    }

    getConfig (): any{
        return JSON.parse(JSON.stringify(this.config));
    }
}