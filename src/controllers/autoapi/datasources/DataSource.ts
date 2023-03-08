interface DataSource {
    query(table: string, reqQuery: object): Promise<object>;
    getEntityByID(entityByIDString: string): Promise<object>;
    metadata(path: string): Promise<object>;
}